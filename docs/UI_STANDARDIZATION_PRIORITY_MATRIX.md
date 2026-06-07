# UI Standardization Priority Matrix - Welo Platform SaaS

This document establishes the UI Standardization Priority Matrix for Welo Platform. It classifies future standardization tasks into four safety categories and defines specific rules to protect business operations.

---

## 🚦 Safety Classifications

Standardization tasks are classified based on their potential impact on application stability, database state integrity, and mobile technician workflows:

- **SAFE:** Tasks limited to static visual overrides, CSS styling alignment, documentation updates, and text labels. Present zero functional risk.
- **CONTROLLED:** Tasks involving component layout updates, form field standardization, and extraction of inline styles into reusable stateless wrappers. Requires QA verification on staging.
- **HIGH-RISK:** Tasks that touch critical operational workflows (such as canvas drawing, file uploads, or drag-and-drop boards). Requires senior developer sign-off and unit test coverage.
- **CRITICAL:** Tasks that affect user sessions, security roles, profile status approvals, database schemas, or billing report exports. Requires multi-developer reviews and manual deployment coordination.

---

## 📊 Standardization Priority Matrix

The table below catalogs future refactoring tasks and assigns their safety tiers:

| Task Name | Target Files | Safety Tier | Scope & Specific Check |
| :--- | :--- | :--- | :--- |
| **Token Reconciliation** | `app/globals.css` | **SAFE** | Add missing color, spacing, radius, and typography custom variables to the root stylesheet. |
| **Timelines & Badges** | `MachineHistorySection.tsx`, `StatusBadge.tsx` | **SAFE** | Replace inline style tags with HSL variables. Standardize badge rounding parameters. |
| **Empty State Extraction** | `/app/dashboard/service-calls/page.tsx` | **SAFE** | Extract empty list text blocks into a reusable `DSEmptyState` primitive. |
| **Form Inputs Standardization** | `NewServiceCallForm.tsx` | **CONTROLLED** | Replace custom input CSS classes with standard form components (`DSInput`, `DSSelect`). |
| **Card Wrappers Standardization** | `ServiceCallCard.tsx` | **CONTROLLED** | Extract inline border paddings and shadows. Wrap in the standardized `DSCard` component. |
| **Mobile Nav Layout** | `MobileBottomNavigation.tsx` | **CONTROLLED** | Verify icon alignment and tap bounds in mobile viewports. |
| **Dispatcher Board** | `DispatchBoard.tsx`, `DispatchCard.tsx` | **HIGH-RISK** | Reconcile spacing between Kanban columns. Fall back to select tags on mobile screens. |
| **Signature Canvas Capture** | `SignatureSection.tsx` | **HIGH-RISK** | Standardize drawing pad borders. Verify viewport scroll lock behaviors. |
| **Photo Upload Interface** | `PhotosSection.tsx` | **HIGH-RISK** | Refactor thumbnail grids. Verify photo upload triggers and compression hooks. |
| **Admin User Table** | `/app/admin/users/page.tsx` | **HIGH-RISK** | Extract the inline users grid into a reusable, responsive `DSTable` component. |
| **Role Redirection Guard** | `src/middleware.ts` | **CRITICAL** | Redesign blocked/rejected screens. Lock role-based redirect checks. |
| **Report PDF Templates** | `#pdf-print-template` in detail page | **CRITICAL** | Reconcile font styles. Strictly prohibit casual width modifications. |

---

## 🔒 Required Protected Areas

Nine core functional domains are designated as **Protected Areas** and must be shielded from casual modifications:
1. **Authentication:** User sign-in, signup, and sign-out pipelines.
2. **Role Management:** Verification checks and role updates inside `/admin/users`.
3. **Dispatcher Board:** Drag-and-drop state transitions on the Kanban dashboard.
4. **Service Call Status Transitions:** Service call status buttons and automatic datetime stamp records.
5. **Photo Uploads:** Multi-file attachments and storage bucket connection handlers.
6. **Signature Capture:** Touch drawing canvas overlays and PNG upload scripts.
7. **PDF Generation:** Capturing, converting, and exporting PDF visit summaries.
8. **Machine History:** Querying and listing previous call records for the client's asset.
9. **Mobile Technician Workflow:** Bottom action bar routing and offline sync states on mobile devices.

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
- **Consolidation Strategy:** [docs/DESIGN_SYSTEM_CONSOLIDATION_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_CONSOLIDATION_STRATEGY.md)
