#!/usr/bin/env node
// Validates both plugin manifests against their vendored JSON Schemas and checks
// that every SKILL.md frontmatter block parses.
//
// The frontmatter check is the important one. Both the Agent Plugins spec and
// Cursor skip an invalid skill silently rather than failing the plugin, so an
// unparseable frontmatter block removes a skill from every client with no error
// surfaced anywhere. We have shipped that bug before.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const rel = (p) => path.relative(root, p);
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

/**
 * Minimal JSON Schema check covering what these two schemas actually constrain:
 * required keys, a closed key set (additionalProperties: false), declared types,
 * and string patterns. Not a general validator — deliberately dependency-free.
 */
function validate(instance, schema, label, where = "") {
  const at = where ? `${label}${where}` : label;

  for (const key of schema.required ?? []) {
    if (!(key in instance)) errors.push(`${at}: missing required field "${key}"`);
  }

  if (schema.additionalProperties === false && schema.properties) {
    const allowed = new Set(Object.keys(schema.properties));
    for (const key of Object.keys(instance)) {
      if (!allowed.has(key)) {
        errors.push(
          `${at}: field "${key}" is not permitted (schema is closed). Allowed: ${[...allowed].sort().join(", ")}`,
        );
      }
    }
  }

  for (const [key, rule] of Object.entries(schema.properties ?? {})) {
    if (!(key in instance)) continue;
    const value = instance[key];
    const spec = rule.$ref ? resolveRef(rule.$ref, schema) : rule;
    if (!spec) continue;

    if (spec.type && !matchesType(value, spec.type)) {
      errors.push(`${at}: field "${key}" should be ${spec.type}, got ${typeof value}`);
      continue;
    }
    if (spec.pattern && typeof value === "string" && !new RegExp(spec.pattern, "u").test(value)) {
      errors.push(`${at}: field "${key}" ("${value}") does not match ${spec.pattern}`);
    }
    if (spec.maxLength && typeof value === "string" && value.length > spec.maxLength) {
      errors.push(`${at}: field "${key}" exceeds maxLength ${spec.maxLength}`);
    }
    if (spec.properties && value && typeof value === "object" && !Array.isArray(value)) {
      validate(value, spec, label, `${where}.${key}`);
    }
  }
}

function resolveRef(ref, schema) {
  if (!ref.startsWith("#/")) return null;
  return ref
    .slice(2)
    .split("/")
    .reduce((node, part) => node?.[part.replace(/~1/g, "/").replace(/~0/g, "~")], schema);
}

function matchesType(value, type) {
  const types = Array.isArray(type) ? type : [type];
  return types.some((t) =>
    t === "object"
      ? value && typeof value === "object" && !Array.isArray(value)
      : t === "array"
        ? Array.isArray(value)
        : t === "integer"
          ? Number.isInteger(value)
          : typeof value === t,
  );
}

// --- manifests -------------------------------------------------------------

const manifests = [
  ["plugin.json", "schemas/agent-plugins-plugin.schema.json", "Agent Plugins manifest"],
  ["mcp.json", "schemas/agent-plugins-mcp.schema.json", "Agent Plugins MCP config"],
  [".cursor-plugin/plugin.json", "schemas/cursor-plugin.schema.json", "Cursor manifest"],
];

for (const [file, schemaFile, label] of manifests) {
  const target = path.join(root, file);
  if (!existsSync(target)) {
    errors.push(`${label}: ${file} is missing`);
    continue;
  }
  try {
    validate(readJson(target), readJson(path.join(root, schemaFile)), `${label} (${file})`);
  } catch (err) {
    errors.push(`${label} (${file}): ${err.message}`);
  }
}

// The Grok manifest has no published schema to validate against, so at minimum
// require it to exist — a missing one costs the plugin its version and its MCP
// server in the xAI marketplace's generated index, with nothing failing loudly.
for (const file of [".grok-plugin/plugin.json", ".mcp.json"]) {
  if (!existsSync(path.join(root, file))) {
    errors.push(`Grok manifest: ${file} is missing`);
  }
}

// The manifests must not drift apart on identity.
try {
  const ap = readJson(path.join(root, "plugin.json"));
  for (const file of [".cursor-plugin/plugin.json", ".grok-plugin/plugin.json"]) {
    const other = readJson(path.join(root, file));
    for (const field of ["name", "version", "license", "homepage", "repository"]) {
      if (ap[field] !== other[field]) {
        errors.push(
          `manifest drift: "${field}" is "${ap[field]}" in plugin.json but "${other[field]}" in ${file}`,
        );
      }
    }
  }
} catch {
  /* already reported above */
}

// Every MCP config must describe the same server URL, even though the transport
// value differs: the spec says "streamable-http", Cursor and Grok Build both use "http".
try {
  const urlsIn = (file) =>
    JSON.stringify(Object.values(readJson(path.join(root, file)).mcpServers ?? {}).map((s) => s.url));
  const canonical = urlsIn("mcp.json");
  for (const file of [".cursor-plugin/mcp.json", ".mcp.json"]) {
    if (urlsIn(file) !== canonical) {
      errors.push(`MCP drift: ${canonical} (mcp.json) vs ${urlsIn(file)} (${file})`);
    }
  }
} catch (err) {
  errors.push(`MCP config: ${err.message}`);
}

// --- skills ----------------------------------------------------------------

const skillsDir = path.join(root, "skills");
if (!existsSync(skillsDir) || !statSync(skillsDir).isDirectory()) {
  errors.push("skills/ directory is missing");
} else {
  const skills = readdirSync(skillsDir).filter((entry) =>
    statSync(path.join(skillsDir, entry)).isDirectory(),
  );
  if (skills.length === 0) errors.push("skills/ contains no skill directories");

  for (const skill of skills) {
    const file = path.join(skillsDir, skill, "SKILL.md");
    if (!existsSync(file)) {
      errors.push(`skills/${skill}: SKILL.md is missing — this skill will be skipped silently`);
      continue;
    }

    const content = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const match = /^---\n([\s\S]*?)\n---/.exec(content);
    if (!match) {
      errors.push(`${rel(file)}: no YAML frontmatter block`);
      continue;
    }

    let front;
    try {
      // PyYAML is the parser skills.sh uses; match it exactly rather than approximating.
      front = JSON.parse(
        execFileSync(
          "python3",
          ["-c", "import sys,json,yaml; json.dump(yaml.safe_load(sys.stdin.read()), sys.stdout)"],
          { input: match[1], encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
        ),
      );
    } catch (err) {
      const stderr = (err.stderr || err.message || "").toString();
      const reason = stderr.match(/^yaml\.[\w.]*Error: (.+)$/m)?.[1] ?? "unparseable";
      const where = stderr.match(/^\s*in "[^"]*", (line \d+, column \d+)/m)?.[1];
      errors.push(
        `${rel(file)}: frontmatter does not parse as YAML — ${reason}${where ? ` (${where})` : ""}.` +
          ` Unquoted values containing ": " are the usual cause; wrap the value in quotes.`,
      );
      continue;
    }

    if (!front || typeof front !== "object") {
      errors.push(`${rel(file)}: frontmatter is not a mapping`);
      continue;
    }
    if (front.name !== skill) {
      errors.push(`${rel(file)}: frontmatter name "${front.name}" does not match directory "${skill}"`);
    }
    if (!front.description) {
      errors.push(`${rel(file)}: frontmatter is missing "description"`);
    } else if (front.description.length > 1024) {
      warnings.push(`${rel(file)}: description is ${front.description.length} chars; keep it short`);
    }
  }
}

// --- assets ----------------------------------------------------------------

try {
  const logo = readJson(path.join(root, ".cursor-plugin/plugin.json")).logo;
  if (logo && !/^https?:\/\//.test(logo) && !existsSync(path.join(root, logo))) {
    errors.push(`Cursor manifest: logo "${logo}" does not exist`);
  }
} catch {
  /* already reported above */
}

// --- report ----------------------------------------------------------------

for (const warning of warnings) console.warn(`warn  ${warning}`);
for (const error of errors) console.error(`error ${error}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`OK — manifests valid, ${readdirSync(skillsDir).length} skills parsed.`);
