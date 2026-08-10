---
name: memory-manifest
description: Discover what a user's Mitosis memory actually contains — connected sources, item counts, and the people and topics it knows about. Use this once at the start of a session to decide which questions are worth routing to memory.
version: 1.0.0
tags: ["memory", "manifest", "discovery", "sources"]
license: MIT
metadata:
  vendor: Mitosis Labs
  homepage: https://mitosislabs.ai
---

# Read the Memory Manifest

Find out what this memory holds before you query it.

## When to use

- Once at the start of a session, before asking memory anything
- The user asks what data is connected, or what their memory knows about
- You need to decide whether a question should go to memory or be answered another way

## How

**Preferred: the `cortex_manifest` tool**, present with no setup once the
`mitosis-memory` plugin is installed. It takes no arguments. Use the CLI below
when the tools are not available.

```bash
mi cortex manifest --office <office-id>
mi cortex manifest --office <office-id> --json    # raw manifest for programmatic use
```

| Flag | Purpose |
|---|---|
| `-o, --office <officeId>` | Office ID. Falls back to `$OFFICE_ID` or the config `defaultOffice` |
| `--json` | Emit raw manifest JSON instead of the rendered block |

## What you get

- Which sources are connected (email, calendar, documents, chat, app data)
- How many items each source has contributed
- The top people and topics the graph knows about

Use that to route questions. If the manifest shows no calendar data, do not ask
memory about the user's schedule — say what is connected instead.

## Notes

- Read the manifest before deciding memory "has nothing". An empty result for
  one query does not mean the source is missing.
- If the manifest itself looks empty or stale, check the pipeline with the
  `memory-status` skill.
