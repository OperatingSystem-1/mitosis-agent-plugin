# Mitosis Memory

Agent plugin that connects an agent to a user's private [Mitosis](https://mitosislabs.ai)
memory through a remote [Model Context Protocol](https://modelcontextprotocol.io/) server.

Mitosis indexes the sources a user has connected — email, calendar, documents,
contacts, chat history and notes — into a private graph. This plugin bundles the
MCP server that queries that graph with seven skills that tell the agent when and
how to use it.

The plugin ships two manifests so the same directory loads in clients that
implement either format:

| Path | Format | Read by |
|---|---|---|
| `plugin.json`, `mcp.json` | [Agent Plugins 1.0.0](https://agent-plugins.org/specification) | VS Code, GitHub Copilot, Kiro, Cursor |
| `.cursor-plugin/plugin.json`, `.cursor-plugin/mcp.json` | [Cursor Plugins](https://cursor.com/docs/plugins) | Cursor |

Both point at the same server and the same `skills/` directory.

## Install

**Cursor** — Settings → Plugins, search for **Mitosis Memory**, Install. Or run
`/add-plugin mitosis-memory` in chat.

**VS Code** — run **Chat: Install Plugin From Source** and enter
`https://github.com/OperatingSystem-1/mitosis-agent-plugin`.

**Skills only, any agent** — the same skills are published standalone:

```bash
npx skills add OperatingSystem-1/mitosis-memory-skills
```

## MCP

```json
{
  "mcpServers": {
    "mitosis": {
      "type": "streamable-http",
      "url": "https://mitosislabs.ai/api/mcp"
    }
  }
}
```

Auth is OAuth 2.0 with PKCE, registered dynamically per client (RFC 7591) — there
is no API key to paste. The client prompts for browser sign-in the first time a
tool is called, and the user picks which memory to expose during consent. The
public read surface (pricing, docs search, platform status, published skills)
answers without any authentication.

## Tools

| Tool | Purpose |
|---|---|
| `cortex_ask` | Hybrid retrieval across the graph, returned as a cited block |
| `cortex_recall` | Semantic vector search |
| `cortex_remember` | Write a durable fact back to memory |
| `cortex_manifest` | Index of connected sources and their counts |
| `cortex_status` | Ingestion state per feed |
| `cortex_ingest_conversation` | Persist the current conversation |
| `cortex_connectable_sources` | Sources available to connect |

## Skills

`memory-ask`, `memory-recall`, `memory-remember`, `memory-manifest`,
`memory-status`, `memory-connect`, `memory-ingest`.

Each prefers the MCP tool when present and falls back to the `mi` CLI
(`npm i -g @mitosislabs/sdk`) when it is not, so the same skill works in a
skills-only install.

## Docs

- Platform documentation: https://mitosislabs.ai/docs
- MCP server card: https://mitosislabs.ai/.well-known/mcp/server-card.json
- Registry entry: `ai.mitosislabs/mitosis` in the official MCP registry

## Development

```bash
node scripts/validate.mjs
```

Validates both manifests against their published JSON Schemas and parses the YAML
frontmatter of every `SKILL.md`. An unparseable frontmatter block makes a skill
silently unresolvable in every client, so this check runs in CI on every push.

## Disclosure

Published by Mitosis Labs, the maintainer of the Mitosis platform this plugin
connects to. Mitosis has a free tier; paid plans are listed at
https://mitosislabs.ai/pricing.

## License

MIT — see [LICENSE](LICENSE).
