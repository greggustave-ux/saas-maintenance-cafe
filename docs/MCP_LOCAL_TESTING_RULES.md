# MCP Local Testing Rules & Drift Categories - Welo Platform SaaS

This document establishes the audit rules, validation categories, and review checkpoints for identifying styling drift between design frames and codebase components.

---

## 📐 Drift Detection Rules & Categories

Design-to-code compliance checks evaluate properties against six specific drift categories:

### 1. Spacing Drift
- **Rule:** Padding, margin, and gap values must align to Welo's 8pt grid tokens.
- **Audit Alert:** Any element containing hardcoded spacing (e.g. `margin: 11px`, `gap: 13px`) that does not map to `var(--space-xs)`, `var(--space-sm)`, `var(--space-md)`, `var(--space-lg)`, or `var(--space-xl)` is flagged.

### 2. Typography Drift
- **Rule:** Typography weight, family, size, and line-height must match the design standard.
- **Audit Alert:** Flag any inline font-size specification (e.g., `font-size: 13px`) or non-standard weights that deviate from typography tokens. Enforces Inter standard.

### 3. Color Drift
- **Rule:** Solid borders, backgrounds, text colors, and highlights must map to theme HSL tokens.
- **Audit Alert:** Any instance of inline HEX color definitions (e.g. `bg-[#0891b2]`) or hardcoded RGBA values in component files triggers a drift flag.

### 4. Component Naming Drift
- **Rule:** Figma component variant names must match local React file names.
- **Audit Alert:** Flag occurrences where component identifiers in design frames differ from their registered name in Welo's Component Registry (e.g., calling a frame `KanbanCard` instead of the registered `DispatchKanbanCard`).

### 5. Token Mismatch Drift
- **Rule:** Token mappings must resolve to identical values across platforms.
- **Audit Alert:** If Figma variables definition changes without an identical update in `globals.css` or typescript tokens, a mismatch is reported.

### 6. Unsupported Variant Drift
- **Rule:** Design variants must correspond to supported React code props.
- **Audit Alert:** Flag if a design component specifies variants (e.g. `status: 'waiting-on-approval'`) that are not defined in the code's types or schemas.

---

## 🔄 Future Local Review & Approval Workflow

All design-system synchronizations follow a strict six-step human-in-the-loop validation pipeline:

```
[Local MCP Inspection] ➔ [Manual Developer Review] ➔ [Approval Checkpoint] ➔ [Controlled Implementation] ➔ [Staging Validation] ➔ [Production Review]
```

### Step 1: Local MCP Inspection
- Run read-only audit scripts locally.
- Review generated JSON files listing detected drift and missing mappings.

### Step 2: Manual Developer Review
- Evaluate the audit report to identify false positives.
- Match Figma node updates to local files.

### Step 3: Approval Checkpoint
- Present proposed changes to the UI coordinator.
- Document proposed token modifications in `docs/LEGACY_UI_MIGRATION_PLAN.md`.

### Step 4: Controlled Implementation
- Manually apply changes file-by-file in the code.
- Enforce type safety check-ins (`tsc --noEmit`).

### Step 5: Staging Validation
- Merge updates into the `staging` branch.
- Inspect viewports and touch targets on emulated mobile layouts.

### Step 6: Production Review
- Open a formal PR to `main`.
- Verify dark/light theme adjustments and merge after approval.
