# Legacy UI Migration Plan - Welo Platform SaaS

This document establishes the rollout, migration roadmap, and execution strategy for migrating Welo Platform's legacy UI elements to the design system.

---

## 📅 Rollout Strategy

To prevent visual regressions or workflow disruption, the design system will rollout through five validation gates:

```
[Local Dev Sandboxing] ➔ [Staging & Visual Review] ➔ [Mobile Device QA] ➔ [Dark Launch Production] ➔ [Release Gate]
```

### 1. Local Validation
- Implement components inside `/src/design-system/components/` and verify layout compliance.
- Run typecheck checks (`tsc --noEmit`) to confirm zero compilation warnings.

### 2. Staging Validation
- Merge features into the `staging` branch.
- Deploy to `staging.welo.app` and verify theme variable changes using Chrome developer tools.

### 3. Mobile Device Testing
- Load staging preview links on emulated viewports (`320px`, `375px`) and actual devices.
- Verify touch targets remain >= 44x44px and that one-thumb action zones are responsive.

### 4. Controlled Production Deployment
- UI migration changes are deployed under light tags.
- No database schemas or API variables are altered during styling migrations.

### 5. Rollback Checkpoints
- If layout breakage or rendering anomalies are reported, the release coordinator reverts changes by rolling back to the previous Git commit.

---

## 🚀 Future Integration Roadmap

- **MCP-Assisted Refactoring:** AI subagents will scan file directories for hardcoded HEX colors or styles and replace them with variable tokens (e.g. `var(--primary)`).
- **Automated Drift Detection:** CI/CD actions will run audits checking for CSS overrides that deviate from `docs/DESIGN_TOKEN_STRATEGY.md`.
- **Snapshot Testing:** Integrate Jest/Playwright HTML snapshot validations to prevent unplanned structure changes.

---

## 🎯 First Migration Candidate: StatusBadge

We propose **StatusBadge** and **PriorityBadge** as the first migration candidates.

- **Reasoning:** Extremely low integration risk, high usage frequency, and does not alter core database interactions or routing rules.
- **Migration Steps:**
  1. Audit Next.js pages for existing inline status markers (e.g. text elements displaying "En Cours" or "Terminé").
  2. Replace inline markers with the new `<StatusBadge status={...} />` component.
  3. Validate contrast ratios and focus outlines locally.
  4. Submit an atomic pull request containing only these badge substitutions.

---

## 📝 Migration Progress & Notes

### ✅ StatusBadge (Migrated)
- **Status:** Migrated as the first safe candidate.
- **Scope:** Replaced static status markers in service call details, operations dashboard, and machine history timeline.
- **Logic:** No business logic or state machines were modified.
- **Database:** No Supabase schema, query, or RLS changes were introduced.

### ✅ PriorityBadge (Migrated)
- **Status:** Migrated as the second safe candidate.
- **Scope:** Replaced static priority badges in ServiceCallCard listings and service call details views.
- **Logic:** No business logic, filters, or sorting rules were altered.
- **Database:** No Supabase schema or query modifications were introduced. Existing production status naming has been fully preserved.

