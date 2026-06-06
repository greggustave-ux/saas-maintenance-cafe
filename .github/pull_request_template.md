## 📝 Description
Provide a summary of the changes introduced by this PR and the user problems they solve.

## 🔗 Related Issue & Figma Spec
- **Issue Link:** Close #[issue-number]
- **Figma Frame/Node Link:** [Insert Link]

## 🛠️ Impacted Systems
Check all systems modified or affected by this pull request:
- [ ] Frontend (React components, styles, utilities)
- [ ] Backend / Supabase Database (Schema, tables, RPCs, seeds)
- [ ] Supabase Security (RLS policies, Roles)
- [ ] Authentication / Session handling
- [ ] CI/CD Pipeline / GitHub Actions
- [ ] External Integrations (Vercel, Figma sync, etc.)

---

## ⚡ Operational Impact
*Identify the operational workflows impacted by these changes. Provide brief descriptions of the exact behavior adjustments.*

- **Dispatch Workflow Impact:** (e.g. how does this affect schedule assignment, dispatch grids, or live ticket streams?)
- **Technician Workflow Impact:** (e.g. changes to technician job logs, status updates, checklist steps, navigation)
- **Inventory Workflow Impact:** (e.g. effects on truck inventory tracking, consumption log triggers, restock thresholds)
- **Offline Workflow Impact:** (e.g. changes to client-side caching, local storage, sync conflicts, status queueing)
- **Analytics Impact:** (e.g. data schema impacts on monthly performance reports, SLA telemetry, dashboard aggregations)

---

## 🗄️ Supabase / Database Impact & Safety
- **Migrations included?** [Yes / No]
- **RLS policies changed or added?** [Yes / No]
- **Backward Compatibility Verified?** [Yes / No / NA] (Confirm that existing active clients will not crash due to altered columns, changed defaults, or dropped constraints)
- **Enum Safety Validated?** [Yes / No / NA] (Confirm that new enum values do not conflict with existing logic, or that enum modifications are handled safely)
- **Rollback SQL commands included?** (Required if changes are made)
  ```sql
  -- Rollback SQL script
  ```
- **Rollback Dependency Verification:** (Confirm that executing the rollback script will safely restore the database schema without breaking dependent triggers, views, or foreign keys)

---

## 📱 Mobile & Responsive Layout Validation
- **Breakpoints tested:** [ ] Mobile (320px-480px) | [ ] Tablet (768px-1024px) | [ ] Desktop (1200px+)
- **Mobile-First CSS Implementation:** [Yes / No] (Confirm styles were declared mobile-first before scaling up with min-width media queries)
- **Describe responsive layout solutions:**

---

## 📸 Media & Visual Proof (Required for UI changes)
Add screenshots, GIFs, or short video recordings demonstrating the changes on both desktop and mobile layouts:
- **Desktop:** [Attach Screenshot/Video]
- **Mobile:** [Attach Screenshot/Video]

---

## 📋 Peer Review & Verification Checklists

*Every reviewer must verify that the PR adheres to these project-wide standards before approval.*

### ♿ Accessibility (a11y) Verification
- [ ] **Focus-Visible:** All interactive components have high-contrast focus indicators using `:focus-visible`.
- [ ] **Keyboard Nav:** Every dynamic control is fully accessible via `Tab` or appropriate arrow keys.
- [ ] **Reduced Motion:** Complex animations use `@media (prefers-reduced-motion: reduce)` fallbacks.
- [ ] **Screen Readers:** Semantic tags are used; dynamic UI updates are bound to `aria-live` or contain clear `.sr-only` descriptions.
- [ ] **Contrast & ID Safety:** Colors satisfy WCAG AA contrast ratios, and all interactive elements have unique, descriptive IDs.

### 📐 Responsive & Mobile Usability Verification
- [ ] **Touch Target Size:** All buttons, inputs, and links have minimum touch targets of **44x44px**.
- [ ] **Spacing Safety:** Clickable elements maintain at least `8px` spacing to prevent mistaps.
- [ ] **Tap highlight:** Custom tap actions override webkit-tap highlights with transparent states.
- [ ] **Viewport Check:** Verified that no horizontal scrollbars occur on viewports down to `320px` width.
- [ ] **Scroll Physics:** Mobile tables or checklists use smooth, native momentum-scrolling wrappers.

### 🎨 Design Token Verification
- [ ] **Typography:** All font styles utilize **Inter** typography, conforming to `docs/DESIGN_SYSTEM_RULES.md` size scales.
- [ ] **No Hardcoding:** Colors and visual definitions map directly to CSS variables (e.g. `var(--primary)`, `var(--background)`). No raw HEX, HSL, or ad-hoc tailwind utility overrides exist.

### 🔄 Rollback & Operations Safety
- [ ] **Rollback Verified:** Database rollback scripts have been local-tested and do not conflict with existing staging/production records.
- [ ] **Env Variables:** Any required environment secrets are documented and requested for preview/staging/production setups.
