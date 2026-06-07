# Mobile Field Usage Audit - Welo Platform SaaS

This document establishes the Mobile Field Usage Audit for Welo Platform. It analyzes mobile viewport constraints, touch targets, canvas drawing interactions, file upload compression, and camera integration parameters.

---

## 📱 Mobile Technician Workflow & Viewports

Technicians operate the Welo Platform on mobile devices in field environments. The primary interface is the detailed service call page at `/dashboard/service-calls/[id]`. This screen handles:
- Notes updates.
- Attachment photo uploads.
- Parts registration.
- Client signature collection.

### 📐 Viewport Constraints
- **Clipping Risk:** Grid layouts in lists and columns (like parts columns) must wrap dynamically. Flex containers must not use fixed pixel widths to prevent horizontal scrollbars on device viewports under `360px`.
- **Landscape Rotation:** Interactive elements (such as signature canvases) require layout flex direction changes to prevent button truncation when rotated.

---

## 👆 Touch Target Sizing & Spacing

To comply with mobile accessibility guidelines (WCAG 2.1 Level AA) and prevent typing errors, all interactive elements must satisfy these metrics:
- **Minimum Interactive Bounds:** All touch actions (buttons, input fields, select dropdowns) must measure at least **`44px x 44px`** (or use Tailwind padding equivalents).
- **Core Elements Verification:**
  - **`MobileBottomNavigation`:** The footer items are configured with safe heights (`min-h-[var(--touch-target-min)]` or `min-h-12`).
  - **Status Selectors:** Dropdowns inside list cards feature padding and height classes to support direct finger taps.
  - **Form Input Boxes:** Inputs (`DSInput`, `DSSelect`, `DSTextarea`) enforce `min-h-12` constraints to prevent input errors.

---

## ✍️ Signature Drawing Canvas Interaction

The signature capture element in [SignatureSection.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/SignatureSection.tsx) is a critical touch interaction boundary:
- **Gestures Handling:** Captures HTML5 `TouchEvents` (`onTouchStart`, `onTouchMove`, `onTouchEnd`).
- **Scroll Lock Necessity:** Drawing gestures on mobile devices will trigger browser window scroll actions, shifting the canvas. The signature component must hook into touch events to lock the viewport window.
- **Canvas Scaling:** When drawing in high-DPI screens (retina viewports), canvas pixel coordinate systems must scale cleanly to prevent blurry signature captures.

---

## 📸 Photo Compression & Camera Uploads

Capturing job photos via camera rolls poses performance risks for mobile web apps:
- **File Sizes:** High-resolution mobile phone camera captures measure between 5MB and 15MB.
- **Client Compression:** Uploading raw blobs directly will trigger network timeouts or browser out-of-memory crashes. The photo uploader must perform client-side image compression (using browser canvas downsizing helper tools) to reduce files to < 500KB before calling `uploadInterventionPhoto`.
- **CORS Constraints:** Discovered that PDF report generation (`html2canvas-pro`) requires photos to be hosted with correct Access-Control-Allow-Origin headers; otherwise, canvas exports fail with permission errors.

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **UI Component Gap Analysis:** [docs/UI_COMPONENT_GAP_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_COMPONENT_GAP_ANALYSIS.md)
