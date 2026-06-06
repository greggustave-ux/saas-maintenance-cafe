# Operational Regression Prevention - Welo Platform SaaS

This document establishes the safety rules, validation checklists, and execution constraints to prevent UI regressions and protect field technician operational workflows during migration tasks.

---

## 🚫 Migration Constraints & Safety Rules

All UI migrations must adhere to these six strict rules. Any pull request violating these constraints will be rejected.

1. **One Component at a Time:** Do not combine multiple component replacements in a single branch or pull request.
2. **No Large Rewrite PRs:** Keep PRs atomic. Limit changes to style properties, components swap, and layout variables. Do not refactor backend routing or API schemas in the same PR.
3. **Preserve Current Workflows:** Component styling updates must not add or delete user actions, workflow states, or required steps without explicit product approval.
4. **Preserve Existing Routes:** Directory paths and Next.js routing patterns (`/app/dashboard`, etc.) must remain unchanged.
5. **Preserve Supabase Interactions:** Do not alter the data-binding structures or SQL triggers during interface refactors.
6. **Preserve Operational Speed:** If a migrated component adds layout thrashing, layout shifts (CLS), or sluggish scrolling, it must be reverted and optimized.

---

## 📋 Operational Regression Validation Checklists

Reviewers and developers must execute these six validation checklists on the staging environment before final release merges:

### 1. Visual Validation Checklist
- [ ] No layout shift (CLS) occurs during initial component render.
- [ ] Text handles long values gracefully (no overlapping or text clipping).
- [ ] Component aligns to the 8pt spacing grid.

### 2. Touch Interaction Checklist
- [ ] Bounding touch target size is verified to be at least **44x44px**.
- [ ] Minimum spacing between clickable elements is at least **8px**.
- [ ] Touch gestures (e.g. swipe to clear) do not conflict with browser window scroll hooks.

### 3. Offline State Checklist
- [ ] Component renders offline indicator banners correctly when the system is disconnected.
- [ ] User entries are saved locally to IndexedDB/LocalStorage, preventing data loss on reload.

### 4. Loading State Checklist
- [ ] Skeleton placeholders render with identical bounds to prevent screen jumps when data is loaded.
- [ ] Spinners utilize CSS animations (`animate-spin`) to avoid layout blockages.

### 5. Dark Mode Checklist
- [ ] Component color classes map correctly to dark theme tokens (verified via OS preferred-color-scheme toggle).
- [ ] Contrast ratios satisfy WCAG AA requirements (minimum 4.5:1 ratio for regular text).

### 6. Accessibility (a11y) Checklist
- [ ] Interactive elements are fully keyboard-navigable via the `Tab` key.
- [ ] Screen readers read active elements using appropriate `role` and `aria-label` tags.
- [ ] Focus outlines utilize `:focus-visible` to prevent visual clutter for mouse users.
