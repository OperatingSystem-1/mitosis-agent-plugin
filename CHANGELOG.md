# Changelog

## Unreleased

- Grok Build manifest (`.grok-plugin/plugin.json`) and MCP config (`.mcp.json`)
  using that ecosystem's `http` transport value, for submission to
  [xai-org/plugin-marketplace](https://github.com/xai-org/plugin-marketplace).
  `.mcp.json` is the shared convention in that ecosystem; the xAI catalog also
  accepts `.claude-plugin/plugin.json` in place of the Grok manifest.
- `scripts/validate.mjs` now holds all three manifests to one identity and one
  server URL, and fails when the Grok pair is absent. The xAI catalog generates
  its component index by scanning exactly these two paths, so a missing `.mcp.json`
  would have published the plugin advertising zero MCP servers, silently.

## 1.0.0

Initial release.

- Agent Plugins 1.0.0 manifest (`plugin.json`) and MCP config (`mcp.json`)
  declaring the Mitosis remote server over `streamable-http`.
- Cursor Plugins manifest (`.cursor-plugin/plugin.json`) with its own MCP config
  using Cursor's `http` transport value.
- Seven memory skills: `memory-ask`, `memory-recall`, `memory-remember`,
  `memory-manifest`, `memory-status`, `memory-connect`, `memory-ingest`.
- `scripts/validate.mjs` — schema validation for both manifests plus SKILL.md
  frontmatter parsing, wired into CI.
