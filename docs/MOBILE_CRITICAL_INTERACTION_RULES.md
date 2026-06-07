# Mobile Critical Interaction Rules - Welo Platform SaaS

This document establishes the Mobile Critical Interaction Rules for Welo Platform. It defines interaction safety and technician workflow stability rules for touch targets, drawing canvases, and camera-based photo uploads.

---

## 📱 Mobile Interaction Safety Rules

Mobile field operations occur on varying viewports. Visual changes must follow these accessibility rules:
1. **Interactive Sizing:** All clickable UI elements (buttons, inputs, select selectors) must occupy a minimum tap dimension of **`44px x 44px`**.
2. **Spacing Gutters:** Maintain a minimum distance of **`8px`** between adjacent interactive elements to prevent click collisions.
3. **Viewport Auto-Wrapping:** List cards, parts summaries, and metadata tables must wrap layout structures dynamically on screen widths <= `360px`.

---

## ✍️ Signature Pad Interaction Rules

The signature canvas element inside [SignatureSection.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/SignatureSection.tsx) is subject to the following interaction rules:
- **Scroll Lock Enforcement:** While a technician draws, the component must disable default document touch gestures. Implement `e.preventDefault()` on `touchstart` and `touchmove` events to lock vertical scroll.
- **Clear Actions Separator:** Place the "Effacer" (Clear) and "Enregistrer" (Save) buttons with at least `12px` of spacing to prevent accidental signature wipes.
- **Coordinate Scaling:** Map touch coordinates relative to the canvas bounding box, taking into account CSS offsets and pixel ratios (`window.devicePixelRatio`).

---

## 📸 Photo Upload Interaction Rules

Adding job attachment photos inside `PhotosSection.tsx` must obey these rules:
- **Client-Side Compression Boundary:** Compress high-resolution images (>2MB) to a maximum size of **500KB** before transmission.
- **MIME Type Validation:** Only accept `image/jpeg` and `image/png` formats. Block raw video or binary attachment formats.
- **Uploading Indicators:** Display a clear progress spinner while calling `uploadInterventionPhoto` and disable submit buttons to prevent double-post submissions.

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
- **PDF UI Protection:** [docs/PDF_UI_PROTECTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PDF_UI_PROTECTION_RULES.md)
