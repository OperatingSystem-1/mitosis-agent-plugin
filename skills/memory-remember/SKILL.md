---
name: memory-remember
description: Write a durable fact, decision, or insight back into the user's Mitosis memory with provenance, so future sessions inherit what this one worked out. Use after reaching a conclusion worth keeping.
version: 1.0.0
tags: ["memory", "write", "facts", "decisions", "provenance"]
license: MIT
metadata:
  vendor: Mitosis Labs
  homepage: https://mitosislabs.ai
---

# Remember a Fact

Write a derived fact back to memory so it survives this session.

## When to use

- You reached a durable conclusion the user will want later (a decision, a
  root cause, a preference, a commitment)
- The user says to remember, save, or note something
- You synthesized something from several sources that would be expensive to
  re-derive

Do not write back things that are already in memory, trivially re-derivable, or
only relevant to the current conversation.

## How

**Preferred: the `cortex_remember` tool**, present with no setup once the
`mitosis-memory` plugin is installed. Pass `text`, and `source_universal_ids`
from a previous `cortex_ask` so the fact links to its evidence. Use the CLI below
when the tools are not available.

```bash
mi cortex remember "<text>" --office <office-id>
mi cortex remember "<text>" --office <office-id> --kind decision --confidence 0.9
mi cortex remember "<text>" --office <office-id> --source <universalId> --source <universalId>
```

| Flag | Purpose |
|---|---|
| `-o, --office <officeId>` | Office ID. Falls back to `$OFFICE_ID` or the config `defaultOffice` |
| `-a, --agent <name>` | Agent identity the fact is attributed to (default: `cli`) |
| `-k, --kind <kind>` | Fact kind, e.g. `decision`, `insight` |
| `-c, --confidence <n>` | Confidence in the range 0 to 1 |
| `-s, --source <universalId...>` | Universal IDs this fact was derived from. Repeatable |

## Provenance matters

Pass `--source` with the universal IDs you drew from. A fact with provenance
can be traced back and re-verified later; one without it is an assertion nobody
can check. You get universal IDs from `mi cortex ask --json`, `mi cortex recall`,
or `mi cortex answer`.

## Writing good facts

- State the conclusion, not the conversation that produced it
- Convert relative dates to absolute ones ("Thursday" becomes the actual date)
- Prefer one clear fact per call over a paragraph carrying several
- Set `--confidence` honestly; a low-confidence fact recorded as certain is
  worse than no fact
