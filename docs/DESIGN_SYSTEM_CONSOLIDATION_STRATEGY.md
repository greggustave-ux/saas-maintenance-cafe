# Design System Consolidation Strategy - Welo Platform SaaS

This document establishes the Design System Consolidation Strategy for Welo Platform. It defines the architectural boundaries, progressive rollout stages, rollback strategies, and primitive component blueprints for the future design system alignment.

---

## 🔒 Architectural Boundaries

To safeguard codebase integrity, the future design system architecture must operate within strict boundaries:
- **Clean Separation of Concerns:** Core UI components (in `src/design-system/components`) must be completely stateless. They must receive props and handle events but contain no database hooks, API initialization, or authentication checks.
- **Pure CSS Variable Injection:** Styled components must use CSS Custom Properties (`var(--primary)`, etc.) mapped in [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css). Hardcoding hex colors or pixel spacings inside component codes is prohibited.
- **Strict Isolation of Protected Zones:** The dispatcher board, signature pad, file uploading, and PDF printing modules must be protected against casual visual overrides to prevent workflow disruptions.

---

## 📈 Progressive Rollout Strategy

Future consolidations must follow a staggered, low-impact rollout cycle:

```
[1. Sandbox Testing] ➔ [2. Canary Deployments] ➔ [3. Feature Flag Rollout] ➔ [4. Full Staging Validation]
```

1. **Local Sandbox Phase:** Reconcile CSS tokens and map unmapped components inside the local dev environment.
2. **Canary Page-by-Page Migration:** Refactor one page at a time, beginning with non-critical layouts (like `/dashboard/clients` and `/dashboard/inventory`).
3. **Feature-Flagged Active Integration:** Roll out components (like `DSButton` and `DSCard`) behind custom React switches to enable immediate rollbacks if visual defects arise.
4. **Full QA Cycle on Staging:** Audit contrast ratios, spacing constraints, and mobile gestures before merging to the production branch.

---

## 🛡️ Rollback & Recovery Strategy

If a design system update introduces layout regressions, console exceptions, or breaks mobile interactions:
- **Git Branch Recovery:** Revert the merge commit on `staging` using `git revert <commit_hash>` and deploy the rollback.
- **CSS Token Fallbacks:** If a new Figma color token breaks readability on dark modes, reset the custom variable inside `globals.css` to the last stable value.
- **Active Feature Kill Switch:** Disable the feature flag for the migrated screen to instantly serve the legacy inline code template.

---

## 📦 Future Primitive Component Blueprints

The strategy establishes specific rules for extracting and standardizing UI primitives:

### 1. Future DSButton Strategy
- **Target:** Extract inline buttons (such as in `/app/admin/users/page.tsx` and the service detail page).
- **Blueprint:** Renders standardized `<button>` element with `min-h-12` heights. Includes variants (`primary`, `secondary`, `danger`, `outline`) mapping colors directly to HSL tokens.

### 2. Future DSCard Strategy
- **Target:** Standardize panel cards across lists and dashboard grids.
- **Blueprint:** Container utilizing `var(--card-bg)`, `var(--card-border)`, and `var(--radius-lg)` variables to unify layout borders.

### 3. Future DSBadge Strategy
- **Target:** Consolidate `StatusBadge` and `PriorityBadge`.
- **Blueprint:** Unify badge paddings, typography, and border properties. Limit variant names to values registered in database enums.

### 4. Future DSModal Strategy
- **Target:** Standardize modal sheets and dialog overlays.
- **Blueprint:** Incorporate keyboard focus locks, overlay backdrop opacity, and scroll locking, while ensuring the background is disabled for clicks.

### 5. Future DataTable Strategy
- **Target:** Modularize data grids in user management and operations pages.
- **Blueprint:** Standard tables with sticky headers, horizontal scrolling controls, and clear text wrappers to prevent clipping on mobile viewports.

### 6. Future FormField Strategy
- **Target:** Harmonize form layouts.
- **Blueprint:** Bind `DSInput`, `DSSelect`, and `DSTextarea` with `DSLabel` inside a layout grid utilizing `--space-sm` gaps.

### 7. Future EmptyState Strategy
- **Target:** Standardize lists empty screens.
- **Blueprint:** Reusable text container with customizable icons and action buttons for empty data screens.

### 8. Future MobileActionBar Strategy
- **Target:** Unify mobile technician views.
- **Blueprint:** Sticky footer action bar presenting primary buttons (like "Start Visit" or "Complete Call") with exact `48px` tap heights.

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **UI Component Gap Analysis:** [docs/UI_COMPONENT_GAP_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_COMPONENT_GAP_ANALYSIS.md)
- **Mobile Field Usage Audit:** [docs/MOBILE_FIELD_USAGE_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_FIELD_USAGE_AUDIT.md)
- **Design System Alignment Plan:** [docs/DESIGN_SYSTEM_ALIGNMENT_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_ALIGNMENT_PLAN.md)
- **Standardization Priority Matrix:** [docs/UI_STANDARDIZATION_PRIORITY_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_STANDARDIZATION_PRIORITY_MATRIX.md)
- **Component Extraction Roadmap:** [docs/COMPONENT_EXTRACTION_ROADMAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_EXTRACTION_ROADMAP.md)
- **Mobile Critical Interactions:** [docs/MOBILE_CRITICAL_INTERACTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_CRITICAL_INTERACTION_RULES.md)
- **PDF UI Protection:** [docs/PDF_UI_PROTECTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PDF_UI_PROTECTION_RULES.md)
