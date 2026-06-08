# DSBadge Blocked Contexts Register - Welo Platform SaaS

This document establishes the DSBadge Blocked Contexts Register for Welo Platform. It catalogs all high-risk UI subsystems, print rendering scripts, and mutation pathways that are strictly excluded from badge migrations.

---

## 🚫 Blocked Subsystem Register

The following rendering environments are locked to prevent regressions:

### 1. PDF Export Templates
- **Impacted Elements:** `#pdf-print-template` in [page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css) (or details view).
- **Block Reason:** html2canvas cannot calculate CSS transparency or opacity properties consistently. May render solid black or transparent borders, causing print layouts to overlap.
- **Rule:** Status/priority values must remain plain text table cells.

### 2. Dispatcher Kanban Drag-and-Drop Board
- **Impacted Elements:** [DispatchCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/dispatch/DispatchCard.tsx) and all components inside `src/modules/service_calls/components/dispatch/`.
- **Block Reason:** Active drag-and-drop actions. Adding interactive dropdown triggers or refactoring card layers presents event bubbling risks.
- **Rule:** Exclude Kanban cards from DSBadge migrations until event propagation tests are passed.

### 3. Authentication & Protected User Flows
- **Impacted Elements:** `/login`, `/register`, and `/admin/users` views.
- **Block Reason:** Protected administrative flows are security-critical and fall outside visual styling scopes.
- **Rule:** Do not modify user profile settings or admin dashboard files.

### 4. Client Signature Canvas Controls
- **Impacted Elements:** [SignatureSection.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/SignatureSection.tsx).
- **Block Reason:** Houses sensitive canvas triggers and file submission states.
- **Rule:** Keep signature controls fully isolated from styling modifications.
