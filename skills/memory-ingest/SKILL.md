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

For individual files or a handful of paths:

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
| A few specific files | `mi cortex ingest <paths...>` |
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
