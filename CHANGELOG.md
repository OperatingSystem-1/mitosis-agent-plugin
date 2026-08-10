# Changelog

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
