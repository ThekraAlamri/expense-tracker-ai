# Best-of-N Evaluation Template

> **What:** [Brief description of the feature being compared]
> **Branches / PRs:** `v1` · `v2` · `v3`
> **Evaluator:** [Your name]
> **Date:** YYYY-MM-DD

---

## Scoring Key

| Score | Meaning |
|-------|---------|
| **5** | Excellent — no meaningful gaps |
| **4** | Good — minor gaps or rough edges |
| **3** | Adequate — works but notable limitations |
| **2** | Poor — significant gaps or problems |
| **1** | Unacceptable — broken, missing, or a liability |

Scores are per-dimension. Sum them for a **Total Score (max 30)** at the end.

---

## Candidates

Briefly describe each candidate before scoring. One or two sentences per version is enough.

| Candidate | Summary |
|-----------|---------|
| **V1** | |
| **V2** | |
| **V3** | |

---

## 1. Feature Completeness

*Do all advertised features actually work end-to-end? Are edge cases covered?*

**Questions to answer:**
- What does each version claim to do?
- Which claimed features are fully functional vs. stubbed / simulated?
- Are empty states, zero-result paths, and boundary conditions handled?
- Does it work without errors on a fresh install / first run?

| Candidate | Notes | Score (1–5) |
|-----------|-------|:-----------:|
| **V1** | | |
| **V2** | | |
| **V3** | | |

---

## 2. Code Quality

*Is the code well-structured, readable, and correct?*

**Questions to answer:**
- How is logic separated from UI? (separation of concerns)
- Are there pure/testable functions, or is logic tangled into components?
- Is TypeScript used effectively (proper types, no `any` abuse)?
- Is there duplicated logic that should be shared?
- Is complexity proportional to the problem? (no over-engineering, no under-engineering)
- Are naming, file structure, and module boundaries clear?

| Candidate | Notes | Score (1–5) |
|-----------|-------|:-----------:|
| **V1** | | |
| **V2** | | |
| **V3** | | |

---

## 3. Security

*Does the implementation introduce any vulnerabilities or risky patterns?*

**Questions to answer:**
- Is user-supplied data sanitized before being written to files or the DOM?
- Are there injection risks? (XSS, CSV formula injection, SQL injection, etc.)
- Are third-party or browser APIs used safely (clipboard, `window.open`, `eval`, etc.)?
- Is sensitive data exposed in URLs, logs, or local storage?
- Are there any supply-chain risks from new dependencies?
- Does anything bypass browser security policies (CSP, CORS, HTTPS)?

| Candidate | Notes | Score (1–5) |
|-----------|-------|:-----------:|
| **V1** | | |
| **V2** | | |
| **V3** | | |

---

## 4. Performance

*Does the implementation avoid unnecessary work and scale reasonably?*

**Questions to answer:**
- Are expensive computations memoized or deferred when appropriate?
- Are there unnecessary re-renders, redundant API calls, or memory leaks?
- Are large assets, bundles, or payloads introduced?
- Does performance degrade with realistic data sizes (e.g., 1 000 or 10 000 records)?
- Are object URLs, event listeners, timers, and subscriptions cleaned up?

| Candidate | Notes | Score (1–5) |
|-----------|-------|:-----------:|
| **V1** | | |
| **V2** | | |
| **V3** | | |

---

## 5. User Experience

*Is the feature intuitive, responsive, and respectful of the user's time?*

**Questions to answer:**
- How many steps does the happy path require?
- Is there feedback for async operations (loading spinners, success/error states)?
- Are destructive or irreversible actions confirmed before execution?
- Does the UI fit the existing design system (colors, spacing, components)?
- Are empty states, errors, and zero-result paths communicated clearly?
- Is the feature discoverable — would a new user find it without documentation?

| Candidate | Notes | Score (1–5) |
|-----------|-------|:-----------:|
| **V1** | | |
| **V2** | | |
| **V3** | | |

---

## 6. Maintainability

*How easy is it to change, extend, and debug this code in the future?*

**Questions to answer:**
- How much code was added, and is that proportional to the value delivered?
- Can a new contributor understand the implementation in under 15 minutes?
- Is extending the feature (e.g., new format, new filter, new destination) a data change or a structural change?
- Are there stubs, simulated behaviors, or placeholder integrations that future work must replace?
- Does the implementation follow the patterns already established in the codebase?
- How isolated is the feature — would removing it require touching many unrelated files?

| Candidate | Notes | Score (1–5) |
|-----------|-------|:-----------:|
| **V1** | | |
| **V2** | | |
| **V3** | | |

---

## Scorecard

| Dimension | Max | V1 | V2 | V3 |
|-----------|:---:|:--:|:--:|:--:|
| Feature Completeness | 5 | | | |
| Code Quality | 5 | | | |
| Security | 5 | | | |
| Performance | 5 | | | |
| User Experience | 5 | | | |
| Maintainability | 5 | | | |
| **Total** | **30** | | | |

---

## Decision

### Winner
> **[Vx]** — one sentence on why.

### What to fix before shipping
- [ ] Item 1
- [ ] Item 2

### What to cherry-pick from the runners-up
- **From Vx:** [specific function / component / pattern worth porting]
- **From Vy:** [specific function / component / pattern worth porting]

### What to discard
- [Feature or pattern that should not be carried forward, and why]
