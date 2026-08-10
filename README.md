<p align="center">
  <img src="assets/logo.svg" width="96" height="96" alt="Mitosis Labs">
</p>

<h1 align="center">Mitosis Memory</h1>

<p align="center">
  <a href="https://agent-plugins.org/specification"><img src="https://img.shields.io/badge/Agent%20Plugins-1.0.0-08080c" alt="Agent Plugins 1.0.0"></a>
  <a href="https://cursor.com/docs/plugins"><img src="https://img.shields.io/badge/Cursor-plugin-08080c" alt="Cursor plugin"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-08080c" alt="MIT"></a>
</p>

Agent plugin that connects an agent to a user's private [Mitosis](https://mitosislabs.ai)
memory through a remote [Model Context Protocol](https://modelcontextprotocol.io/) server.

Mitosis indexes everything a user has connected into a single private graph —
Google Workspace, Slack, Discord, Notion, Linear, GitHub, Obsidian vaults,
WhatsApp, Telegram and Signal messages, uploaded files and documents, and prior
conversations with other AI tools including ChatGPT, Claude and Codex. Sources
outside that list can be registered as custom feeds and are searchable the same
way.

This plugin bundles the MCP server that queries the graph with seven skills that
tell the agent when and how to use it.

The plugin ships two manifests so the same directory loads in clients that
implement either format:

| Path | Format | Read by |
|---|---|---|
| `plugin.json`, `mcp.json` | [Agent Plugins 1.0.0](https://agent-plugins.org/specification) | VS Code, GitHub Copilot, Kiro, Cursor |
| `.cursor-plugin/plugin.json`, `.cursor-plugin/mcp.json` | [Cursor Plugins](https://cursor.com/docs/plugins) | Cursor |
| `.grok-plugin/plugin.json`, `.mcp.json` | [Grok Build plugins](https://github.com/xai-org/plugin-marketplace) | Grok Build |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | [Claude Code plugins](https://code.claude.com/docs/en/plugin-marketplaces) | Claude Code, Cowork |

All four point at the same server and the same `skills/` directory.

## Install

**Cursor** — Settings → Plugins, search for **Mitosis Memory**, Install. Or run
`/add-plugin mitosis-memory` in chat.

**VS Code** — run **Chat: Install Plugin From Source** and enter
`https://github.com/OperatingSystem-1/mitosis-agent-plugin`.

**Grok Build** — type `/marketplace`, find **mitosis-memory**, press `i`. Or run
`grok plugin install mitosis-memory --trust` from the terminal.

**Claude Code** — add this repo as a marketplace, then install:

```
/plugin marketplace add OperatingSystem-1/mitosis-agent-plugin
/plugin install mitosis-memory@mitosis
```

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

These read the user's own data and require sign-in. The server also exposes a
public surface that needs no account:

| Tool | Purpose |
|---|---|
| `get_pricing` | Plans, credit allowances, metered rates, add-ons |
| `search_docs` | Keyword search across the documentation |
| `get_platform_status` | Operational status of the site, API, and MCP server |
| `list_skills` | Agent skills published by Mitosis |

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

Published by Mitosis Labs, Inc., the maintainer of the Mitosis platform this
plugin connects to.

Mitosis is a commercial service: a 7-day trial, then plans from $7.99/month.
The public tools above — `get_pricing`, `search_docs`,
`get_platform_status`, `list_skills` — need no account. The `cortex_*` tools
read a user's own connected data and require sign-in.
[Plans and pricing](https://mitosislabs.ai/#pricing).

---

## Legal

**Copyright © 2026 Mitosis Labs, Inc. All rights reserved.**

### License

The source in this repository — manifests, validation scripts, CI configuration
and skill documents — is released under the [MIT License](LICENSE). You may use,
copy, modify, and redistribute it under those terms, provided the copyright
notice and license text travel with it.

### Trademarks

**Mitosis**, **Mitosis Labs**, the Mitosis logo, and the hexafoil mark in
`assets/logo.svg` are trademarks of Mitosis Labs, Inc., whether or not
registered.

The MIT License covers the code in this repository and grants **no** licence,
express or implied, to any Mitosis trademark, service mark, logo, or trade name.
You may not use them to name or brand a fork or derivative work, to suggest
sponsorship, affiliation, or endorsement by Mitosis Labs, or in a way likely to
cause confusion as to origin. Nominative reference — stating accurately that a
work interoperates with Mitosis — is permitted. Any other use requires prior
written permission.

### Hosted service

The MCP endpoint at `https://mitosislabs.ai/api/mcp`, the Mitosis platform, and
the data reachable through them are a hosted service operated by Mitosis Labs,
Inc. They are **not** covered by the MIT License and are not redistributable.
Access is governed by the [Terms of Service](https://mitosislabs.ai/terms) and
the [Privacy Policy](https://mitosislabs.ai/privacy). Nothing in this repository
grants a right to operate a competing or derivative service under the Mitosis
name, or to access the platform other than through published interfaces.

### Content and assets

Documentation, prose, and brand assets in this repository — including
`assets/logo.svg` — are © Mitosis Labs, Inc. The logo may be reproduced
unmodified to identify this plugin or an integration with Mitosis. It may not be
altered, recoloured, incorporated into another mark, or used as the icon of a
different product.

### Third-party notices

Skill documents are also published, under the same MIT terms, at
[`mitosis-memory-skills`](https://github.com/OperatingSystem-1/mitosis-memory-skills).
The Agent Plugins and Cursor JSON Schemas vendored in `schemas/` remain the
property of their respective authors and are included solely for offline
validation.

### Contact

Licensing, trademark permission, and security reports: **pj@mitosislabs.ai**

<p align="center">
  <sub>© 2026 Mitosis Labs, Inc. &nbsp;·&nbsp; <a href="https://mitosislabs.ai">mitosislabs.ai</a> &nbsp;·&nbsp; <a href="https://mitosislabs.ai/terms">Terms</a> &nbsp;·&nbsp; <a href="https://mitosislabs.ai/privacy">Privacy</a></sub>
</p>
