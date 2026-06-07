# PDF UI & Dispatcher Board Protection Rules - Welo Platform SaaS

This document establishes the PDF UI & Dispatcher Board Protection Rules for Welo Platform. It defines rendering protection parameters for print templates and Kanban drag-and-drop columns to prevent layouts and API synchronization regressions.

---

## 📄 PDF Report Rendering Protection Rules

The PDF visit report generation inside [app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx#L574-L586) uses a hidden DOM node (`#pdf-print-template`) processed by `html2canvas-pro` and `jspdf`. Visual adjustments to this template must follow these guidelines:

### 1. Element Positioning Boundaries
- **Rule:** The template must remain positioned off-screen using `position: absolute; left: -9999px;`.
- **Constraint:** Do not use `display: none;` or `visibility: hidden;` to hide the template, as this prevents `html2canvas-pro` from rendering the DOM elements.

### 2. Fonts and Styling Constraints
- **Rule:** Only use basic system typography (Arial, sans-serif) in the print template.
- **Constraint:** Do not bind custom Google Fonts or local stylesheet overrides without verifying Access-Control-Allow-Origin settings, as untrusted fonts block the canvas export.

### 3. Image CORS Policies
- **Rule:** All photos and signatures rendered inside the report must resolve to CORS-compliant URLs.
- **Constraint:** If an attachment image fails CORS policies, the PDF generation function will crash with the message: *"Impossible de générer le PDF. Les images n'ont peut-être pas des permissions CORS valides."*

---

## 🎛️ Dispatcher Board Protection Rules

The Dispatcher Board (`/dashboard/dispatch`) manages active ticket queues and must be protected against layout drifts:

### 1. Drag-and-Drop Boundaries
- **Rule:** Kanban columns must use dynamic flex widths and avoid fixed pixels dimensions.
- **Constraint:** Do not modify grid gutter styles without verifying touch interaction thresholds in mobile browser simulations.

### 2. Fallback Interactive Selectors
- **Rule:** The board must preserve select dropdown controls as touch fallbacks on viewports <= `768px` where drag-and-drop gesture controls are disabled.
- **Constraint:** Aligning selectors must not remove the option tag handlers that execute the database changes (`updateServiceCallTechnician`, `updateServiceCallPriority`).

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
- **Priority Matrix:** [docs/UI_STANDARDIZATION_PRIORITY_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_STANDARDIZATION_PRIORITY_MATRIX.md)
- **Extraction Roadmap:** [docs/COMPONENT_EXTRACTION_ROADMAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_EXTRACTION_ROADMAP.md)
- **Mobile Critical Interactions:** [docs/MOBILE_CRITICAL_INTERACTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_CRITICAL_INTERACTION_RULES.md)
