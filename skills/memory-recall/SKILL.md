---
name: memory-recall
description: Semantic-only vector search across the user's Mitosis memory, returning hits with their source and a content excerpt. Use when you want raw similar passages rather than a synthesized cited block.
version: 1.0.0
tags: ["memory", "search", "semantic", "vector", "excerpts"]
license: MIT
metadata:
  vendor: Mitosis Labs
  homepage: https://mitosislabs.ai
---

# Recall from Mitosis Memory

Semantic-only vector search. Each hit carries its source and a content excerpt.

## When to use

- You want the raw passages, not a synthesized answer block
- You are looking for conceptually similar material where exact keywords fail
- You are building your own ranking or summarization on top of the hits

For a cited, ready-to-use context block, use the `memory-ask` skill instead.

## How

**Preferred: the `cortex_recall` tool**, present with no setup once the
`mitosis-memory` plugin is installed. Pass `query`. Use the CLI below when the
tools are not available.

```bash
mi cortex recall "<query>" --office <office-id>
```

| Flag | Purpose |
|---|---|
| `-o, --office <officeId>` | Office ID. Falls back to `$OFFICE_ID` or the config `defaultOffice` |

## Choosing between recall, ask, and answer

| Command | Retrieval | Returns |
|---|---|---|
| `mi cortex recall` | Semantic only | Hits with source + excerpt |
| `mi cortex ask` | Hybrid (vector + full-text + graph) | Rendered, cited context block |
| `mi cortex answer` | Hybrid | Raw JSON: RRF scores, per-leg signals, freshness, provenance |

Reach for `recall` when semantic similarity is the whole job. Reach for `ask`
when you are about to answer a user's question and need citations.

## Following a hit to its source

Every result carries a universal ID. To pull the original row with full
provenance:

```bash
mi cortex get <universalId> --office <office-id>
```
