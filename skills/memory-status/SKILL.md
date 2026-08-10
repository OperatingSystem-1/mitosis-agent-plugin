---
name: memory-status
description: Check the state of the user's Mitosis memory pipeline — totals, embedding and graph coverage, and per-feed freshness. Use when a query returns nothing, to tell "no data" apart from "still ingesting".
version: 1.0.0
tags: ["memory", "status", "health", "freshness", "diagnostics"]
license: MIT
metadata:
  vendor: Mitosis Labs
  homepage: https://mitosislabs.ai
---

# Check Memory Status

Read the pipeline state before concluding anything about missing data.

## When to use

- A query came back empty and you need to know why
- The user says memory is missing something they expect it to have
- You want to know how fresh a particular source is before relying on it

## How

**Preferred: the `cortex_status` tool**, present with no setup once the
`mitosis-memory` plugin is installed. It takes no arguments. Use the CLI below
when the tools are not available.

```bash
mi cortex status --office <office-id>
```

| Flag | Purpose |
|---|---|
| `-o, --office <officeId>` | Office ID. Falls back to `$OFFICE_ID` or the config `defaultOffice` |

## What you get

- Total items in memory
- Embedding and graph coverage — how much of the corpus is actually retrievable
- Per-feed freshness — when each connected source last delivered

## Reading the result

An empty answer plus healthy status means the data genuinely is not there — say
so plainly. An empty answer plus low coverage or a stale feed means ingestion is
behind, and the honest response is "that source is still catching up", not
"you have no such data".

If a feed looks stuck, `mi doctor` diagnoses local SDK configuration and
connectivity.
