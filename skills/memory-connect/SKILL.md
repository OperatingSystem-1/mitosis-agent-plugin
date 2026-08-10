---
name: memory-connect
description: Wire this agent to the user's private Mitosis memory so the connection survives future sessions. Use when the user says to connect, set up, or link their Mitosis memory, or when a memory query fails because nothing is configured yet.
version: 1.0.0
tags: ["memory", "connect", "setup", "onboarding"]
license: MIT
metadata:
  vendor: Mitosis Labs
  homepage: https://mitosislabs.ai
---

# Connect an Agent to Mitosis Memory

Persistently wire the agent you are running in (Claude Code, Cursor, Codex,
Gemini, Grok, Windsurf) to the user's Mitosis office memory.

## When to use

- The user asks to connect, set up, or link their Mitosis memory
- A `mi cortex` command fails because no office or credential is configured
- The user wants the connection to persist across future sessions, not just this one

## How

```bash
npm install -g @mitosislabs/sdk
mi login                       # browser OAuth; the human approves, you never handle the credential
mi cortex manifest             # confirm the memory is reachable and see what it holds
mi connect                     # writes the memory rule + MCP config for the detected agent
```

Useful flags on `mi connect`:

| Flag | Purpose |
|---|---|
| `-o, --office <officeId>` | Target office. Falls back to `$OFFICE_ID`, saved config, or the user's sole office |
| `-c, --client <name...>` | Which agents to configure: `claude-code`, `cursor`, `codex`, `grok`, `gemini`, `windsurf`, `agents-md`. Defaults to auto-detect |
| `--project-dir <dir>` | Project directory for project-scoped files (default: cwd) |
| `--dry-run` | Print what would be written, change nothing |
| `--json` | Machine-readable summary |

Run `mi connect --dry-run` first if the user wants to review the changes before
anything is written. `mi disconnect` removes what `mi connect` wrote and leaves
unrelated content intact.

## Notes

- Authentication is a device-code browser flow the human approves. The agent
  never handles a raw credential.
- If you need the office ID and cannot infer it, ask the human once. They can
  copy it from the "Connect your agent" card on https://mitosislabs.ai/graph.

Full walkthrough: https://mitosislabs.ai/connect.md
