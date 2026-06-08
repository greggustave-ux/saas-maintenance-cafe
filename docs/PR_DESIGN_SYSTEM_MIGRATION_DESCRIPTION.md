# PR Description: Design System Foundations & Card/Form Migration

## 📝 Overview & Summary
This pull request introduces the first major operational UI migration to the new design system architecture on the Welo Platform. It creates the foundational forms component registry, standardizes key UI cards (`ServiceCallCard`, `DispatchKanbanCard`), and implements the service call creation form primitives. 

This is a controlled visual and structural standardization. All underlying business logic, routing structures, database queries, and Supabase security rules are completely untouched.

---

## 🔍 Migration Scope

### 🛠️ What Changed
- **Design Tokens Integration:** Swapped hardcoded style properties (colors, borders, spacing, radii, typography) for semantic design-system tokens (`var(--space-*)`, `var(--card-bg)`, etc.).
- **Badges Standardization:** Integrated `<StatusBadge>` and `<PriorityBadge>` components.
- **Card Migrations:** Refactored `ServiceCallCard` and `DispatchCard` to use CSS variables and badges while maintaining interactive status, priority, and technician selects.
- **Form Foundations:** Developed a folder of six reusable form components under `/src/design-system/components/forms/` (`DSInput`, `DSSelect`, `DSLabel`, `DSTextarea`, `DSFormSection`, `DSValidationMessage`).
- **Form Migration:** Standardized `NewServiceCallForm` using the new form components.
- **Touch Target Optimization:** Standardized all inputs, select boxes, and interaction zones to at least **44x44px** to meet mobile viewport criteria.
- **Metadata Registries:** Tagged and versioned all migrated components in `src/design-system/registry/component-registry.ts` and associated markdown plans.

### 🚫 What Did NOT Change
- **No Supabase Modifications:** No SQL queries, database tables, row-level security (RLS) rules, API routes, or data bindings were altered.
- **No Route Mutations:** Next.js routing structures, client routes, and folder structures remain identical.
- **No Workflow Redesigns:** The dispatch Kanban board column list, card mutations, technician assignment workflow, and dashboard KPI calculations function exactly as before.
- **No Auth Modifications:** Credentials, roles, authentication states, and permissions gates are unchanged.
- **No MCP Connection:** The repository configuration is prepared for synchronized UI metadata but has no direct connection or active write privileges to production schemas.

---

## 📱 Mobile-First Validation Notes
- Interactive dropdown elements and action buttons are locked to a minimum touch target height of **44px** (`var(--touch-target-min)`).
- Input margins use one-thumb-friendly layouts (`var(--space-md)`).
- Checked for and prevented any horizontal overflow or wrapping layout breaks on narrow emulated screens (down to `320px` viewport widths).
- Input type attributes preserve correct keyboard layouts on mobile devices (e.g. standard alphanumeric, textareas).

---

## 🔒 Safety & Security Confirmations
- **Supabase Safety:** All database queries remain static. No SQL migration scripts or API schema overrides are included in this branch.
- **MCP Security boundaries:** No automatic synchronization tools are enabled. All design-to-code adjustments generated via AI tools require manual developer validation and pull request review prior to merge.

---

## 📋 PR Validation Checklist
- [x] Type Safety: `npx tsc --noEmit` returns **0 compilation errors**.
- [x] Compilation: `npm run build` succeeds and compiles the Next.js application cleanly with Turbopack.
- [x] Theme Compatibility: Colors and borders adapt automatically to dark mode preference styles.
- [x] Registry Compliance: All migrated components declare their corresponding `data-welo-component` tags and metadata configurations.

---

## 🧪 Manual Testing Instructions
1. **Dispatch Board Verification:**
   - Navigate to `/dashboard/dispatch` and confirm all Kanban columns (`Nouveau`, `Assigné`, `En route`, `Sur place`, `En attente de pièces`, `Terminé`) render correctly.
   - Verify that changing card status or priority via the selects correctly triggers dispatch events.
   - Validate that assigning a technician via the dropdown behaves as expected.
2. **Service Call Listing & Detail Verification:**
   - Confirm list views render the cards using standard borders, typography, and badges.
   - Check mobile rendering and ensure touch zones are easily clickable.
3. **Form Verification:**
   - Open the "Créer une nouvelle fiche" form from the dashboard.
   - Fill out fields and submit; verify successful call creation and toast/success feedback animations.
   - Submit empty fields to confirm native constraint validations trigger and show standard layouts.
