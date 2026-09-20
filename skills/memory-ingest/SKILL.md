---
name: memory-ingest
description: Ingest local files or a whole Markdown folder (such as an Obsidian vault) into the user's Mitosis memory so they become searchable. Use when the user wants their notes, docs, or a directory added to memory.
version: 1.0.0
tags: ["memory", "ingest", "obsidian", "vault", "files"]
license: MIT
metadata:
  vendor: Mitosis Labs
  homepage: https://mitosislabs.ai
---

# Ingest Files into Memory

Add local content to memory so it can be retrieved later.

## When to use

- The user wants specific files added to their memory
- The user wants a notes folder or Obsidian vault synced
- You produced an artifact worth keeping as searchable content

## How

Prefer the MCP tool when you have it.

**stdio MCP** (`mi-cortex-mcp`): `cortex_ingest` with `path` or `paths`.
**remote MCP**: `cortex_ingest` with `filename` + `content` (or `files[]`).
Read the file yourself first if the server cannot see the disk.

A new source waits for Standard or a described goal — record that with
`cortex_choose_enrichment`. Do not choose for the user.

If you are shelling out instead, for individual files or a handful of paths:

```bash
mi cortex ingest <paths...> --office <office-id>
```

For a whole folder of Markdown — recurses, chunks large notes, resumable:

```bash
mi cortex sync-vault <dir> --office <office-id>
```

## Which command to use

| Situation | Command |
|---|---|
| A few specific files (MCP) | `cortex_ingest` (`path` on stdio, or `filename`+`content` on remote) |
| A few specific files (CLI) | `mi cortex ingest <paths...>` |
| A notes directory or Obsidian vault | `mi cortex sync-vault <dir>` |

`sync-vault` skips `.obsidian`, `.trash`, and `.git`, chunks large notes so they
retrieve well, and is idempotent and resumable — safe to re-run after an
interruption.

## What happens to each file

- Text becomes searchable content in memory
- Binaries go to the office drive with a metadata row pointing at them

## Before you ingest

Confirm with the user which paths they mean. Ingesting a home directory or a
repo full of dependencies fills memory with noise and makes later retrieval
worse. Prefer the specific folder they care about.

After ingesting, check that it landed:

```bash
mi cortex status --office <office-id>
```
