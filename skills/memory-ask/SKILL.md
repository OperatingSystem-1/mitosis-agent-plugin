---
name: memory-ask
description: Query the user's private Mitosis memory (email, calendar, documents, contacts, chat, project history) and get back a cited, prompt-ready context block. Use before answering any question about the user, their work, schedule, contacts, projects, or decisions.
version: 1.0.0
tags: ["memory", "search", "retrieval", "citations", "rag"]
license: MIT
metadata:
  vendor: Mitosis Labs
  homepage: https://mitosislabs.ai
---

# Ask Mitosis Memory

Hybrid retrieval — vector, full-text, and graph — rendered as a cited block you
can drop straight into your context.

## When to use

- Before answering ANY question about the user, their work, schedule, contacts,
  projects, documents, decisions, or history
- Whenever the user's own data would change your answer
- Even when you think you already know — the graph is their current data, your
  training is not

Do not tell the user you lack access to their email, calendar, or files until
you have asked memory first.

## How

**Preferred: the `cortex_ask` tool.** Installing the `mitosis-memory` plugin
configures the Mitosis MCP server, so this tool is present with no setup and
authorises itself in the browser the first time it is called. Pass the user's
question; you get back ranked results with provenance and a `graph_url` deep link
into their own graph.

The CLI below does the same work and is the path when the tools are not present,
such as a bare `npx skills add` install or a shell script.

```bash
mi cortex ask "<question>" --office <office-id>
mi cortex ask "<question>" --office <office-id> --limit 12
mi cortex ask "<question>" --office <office-id> --json     # raw answer JSON
```

| Flag | Purpose |
|---|---|
| `-o, --office <officeId>` | Office ID. Falls back to `$OFFICE_ID` or the config `defaultOffice` |
| `-l, --limit <n>` | Max results (default: 8) |
| `-a, --agent <name>` | Agent identity recorded for provenance (default: `cli`) |
| `--json` | Raw answer JSON instead of the rendered block |

Related commands for different shapes of the same question:

- `mi cortex answer "<query>"` — raw JSON with RRF scores, per-leg signals, freshness, provenance
- `mi cortex recall "<query>"` — semantic-only vector search (see the `memory-recall` skill)
- `mi cortex get <universalId>` — the original source row behind a result

## Citing

Results carry sources. Cite what you use with `[n]` markers and a `Sources:`
block so the user can trace any claim back to the underlying email, document,
or event.

## If a result is empty

Run `mi cortex status --office <office-id>` before concluding the data does not
exist — an empty answer can mean the feed is still ingesting. Try shorter, bare
search terms too; long natural-language strings retrieve less well than the
distinctive nouns inside them.
