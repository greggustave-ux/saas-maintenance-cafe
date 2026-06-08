# Design-to-Code Readiness Audit - Welo Platform SaaS

This document establishes the Design-to-Code Readiness Audit for Welo Platform. It evaluates the current alignment between the UI design assets and the frontend codebase, highlighting token mapping gaps, structural code fragilities, mobile form limitations, and safety boundaries to ensure a regression-free design system synchronization.

---

## 🚦 Overall Readiness Assessment

The Welo Platform codebase is **partially ready** for controlled Figma/MCP design synchronization. While standard component wrappers and basic theme structures are configured, several significant blockers and drift risks must be addressed before executing any active synchronization:

1. **Token Inconsistencies (Severe):** The TypeScript token definitions (`colors.ts`, `radius.ts`, `spacing.ts`, `typography.ts`, `touchTargets.ts`) map values to CSS variables that are entirely missing in [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
2. **Structural Component Bloat (High):** Admin user management, dispatcher boards, and operations widgets are implemented as large, inline page files. Modifying styles on these pages poses a risk to state machine transitions and database API calls.
3. **PDF Generation Lock (Critical):** The PDF export mechanism relies on capturing a hidden DOM element (`#pdf-print-template`) using `html2canvas-pro` and `jspdf`. Redesigning these elements will break page formatting, text rendering, or cause cross-origin image failures.

---

## 🔒 Safety & Governance Boundaries

All design-to-code alignments must be conducted under strictly passive inspection boundaries. Automated mutations of component code or styling files are blocked.

### 🚫 Forbidden Redesigns
- **PDF Layout Blocks:** Any styling change inside the `#pdf-print-template` element is blocked.
- **Form Submission Action Handlers:** Form layout changes must not alter the underlying submit hooks, validation criteria, or state managers.
- **Routing & Role Indicators:** Sidebar navigation links and role-based redirect pathways cannot be updated during visual sync checks.

### 🚨 Emergency Stop Integration
If any automated procedure attempts to modify source code, alter database schemas, or bypass approval gates, developers must execute an immediate shutdown.
- Refer to [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md#L51-L62) for the exact triggers and halt checklist.

---

## 📊 Screen Risk Assessments

Different screens in Welo present varying levels of risk during visual adjustments:

### 1. Admin User Management Screen ([app/admin/users/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/admin/users/page.tsx))
- **Risk Tier:** **HIGH**
- **Symptom:** Renders profile tables, role modification dropdowns, and confirmation modal overlays inline.
- **Danger:** Aligning the styling of dropdown fields or modals could disrupt the critical `admin_update_profile` transaction hook, leading to role escalation vulnerabilities or broken profile approvals.

### 2. Dispatch Kanban Board Screen ([app/dashboard/dispatch/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/dispatch/page.tsx))
- **Risk Tier:** **HIGH**
- **Symptom:** Implements drag-and-drop container lists using custom physics and touch gesture overrides.
- **Danger:** Visual resizing of cards or column grid gaps can break layout calculations on small screens, causing cards to overlap or fall out of alignment.

### 3. Service Call Details Screen ([app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx))
- **Risk Tier:** **CRITICAL** (due to PDF and signature capture integrations)
- **Symptom:** Incorporates the HTML5 signature drawing pad, photo uploads, billing parts forms, and off-screen PDF printing layouts.
- **Danger:** Editing sizes or flex directions can cause the signature pad to clear, files to upload in unsupported formats, or the PDF download to break on page cuts.

### 4. Operations Dashboard Screen ([app/dashboard/operations/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/operations/page.tsx))
- **Risk Tier:** **MEDIUM**
- **Symptom:** Renders analytics charts, layout stats grids, and filters.
- **Danger:** Layout drifts can clip labels or graphs on mobile screens, but does not present database state risks.

---

## 📂 Audit Index
Refer to these detailed audit documents to proceed:
- **UI Component Gap Analysis:** [docs/UI_COMPONENT_GAP_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_COMPONENT_GAP_ANALYSIS.md)
- **Mobile Field Usage Audit:** [docs/MOBILE_FIELD_USAGE_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_FIELD_USAGE_AUDIT.md)
- **Design System Alignment Plan:** [docs/DESIGN_SYSTEM_ALIGNMENT_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_ALIGNMENT_PLAN.md)
- **Passive Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
- **MCP Setup Checklist:** [MCP_SETUP_CHECKLIST.md](file:///c:/Users/Dylan/Documents/welo_platform/MCP_SETUP_CHECKLIST.md)
