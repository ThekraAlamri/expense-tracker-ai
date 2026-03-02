Generate comprehensive documentation for the feature named: $ARGUMENTS

Follow every step below exactly and in order.

---

## Step 1 — Discover relevant files

Search the codebase for files related to **$ARGUMENTS**. Cast a wide net:
- Glob for files whose path contains keywords derived from the feature name (e.g. `*export*`, `*hub*`, `*data*`)
- Grep for function names, component names, or type names that match the feature
- Read every file you find that belongs to the feature
- Also read the root `app/page.tsx` and `app/layout.tsx` to understand how the feature is integrated

Record every file path you discover; you will reference them in the docs.

---

## Step 2 — Detect feature type

Based on the files found, classify the feature as one of:
- **frontend** — only React components / hooks / CSS
- **backend** — only API routes / server actions / DB logic
- **full-stack** — touches both UI and server/data layers

This classification controls the depth of technical content in the developer doc.

---

## Step 3 — Ensure output directories exist

Run:
```
mkdir -p docs/dev docs/user
```

---

## Step 4 — Write the DEVELOPER documentation

Create `docs/dev/$ARGUMENTS-implementation.md` with the following sections.
Use real, specific details discovered in Step 1 — no placeholders or invented content.

```markdown
# {Feature Display Name} — Developer Implementation Guide

> **Feature type:** {frontend | backend | full-stack}
> **Last updated:** {today's date}

## Overview
One paragraph describing what the feature does and the problem it solves.

## How it fits into the architecture
Explain where this feature lives in the codebase and how it connects to the rest of the app
(routing, data layer, shared components, etc.).

## Files created / modified
List every file that is part of this feature with a one-line explanation of its role.

| File | Role |
|------|------|

## Key types and interfaces
List every TypeScript interface or type used by the feature, with field-level annotations.

## Function / component reference
For each exported function or React component, document:
- **Signature** (params + return type)
- **Purpose**
- **Important behaviour / side effects**

## State management & data flow
Describe how data moves: what reads from localStorage / API / props, what writes, and in what order.
Include a simple numbered flow if helpful.

## Dependencies & libraries
List every external import used (package name, version if known, what it provides).

## Edge cases & error handling
Enumerate known edge cases and how the code handles (or defers) each one.

## Security considerations
Note any input validation, XSS risks, auth concerns, or data-exposure issues relevant to this feature.

## Performance notes
Mention memoisation, lazy loading, debouncing, or other perf decisions made.

## Testing recommendations
Suggest concrete unit, integration, and E2E test cases for this feature.

## Related developer docs
- [Link to other dev docs once they exist]

---
*See also: [User guide → docs/user/how-to-$ARGUMENTS.md](../user/how-to-$ARGUMENTS.md)*
```

---

## Step 5 — Write the USER documentation

Create `docs/user/how-to-$ARGUMENTS.md` with the following sections.
Write in plain English — no jargon, no code. Imagine the reader has never opened a developer tool.

```markdown
# How to Use {Feature Display Name}

## What is this feature?
One or two sentences explaining what it does and why it's useful.

## How to access it
Short description of where to find this feature in the UI (menu, button, page, etc.).

## Step-by-step guide

1. **{Action}** — {what happens}
2. **{Action}** — {what happens}
(continue for every meaningful step)

[SCREENSHOT: {description of what to capture for each major step}]

## Common questions

**Q: {question}**
A: {answer}

(add 3–5 Q&A pairs relevant to this feature)

## Troubleshooting

| Problem | Solution |
|---------|----------|
| {problem} | {solution} |

## Related guides
- [Link to related user guides once they exist]

---
*For technical details, see: [Developer guide → docs/dev/$ARGUMENTS-implementation.md](../dev/$ARGUMENTS-implementation.md)*
```

---

## Step 6 — Verify

After writing both files, read them back and confirm:
- [ ] No placeholder text like `{...}` remains
- [ ] Every file listed in the developer doc was actually found in Step 1
- [ ] The cross-reference links at the bottom of each file are correct
- [ ] The feature type detected in Step 2 is reflected in the developer doc header

Report a brief summary of what was generated and where the files were saved.
