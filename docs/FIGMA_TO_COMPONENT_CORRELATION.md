# Figma to Component Correlation - Welo Platform SaaS

This document establishes the Figma to Component Correlation map for the Welo Platform. It defines the relationships between Figma design components and React codebase implementations, classifying each based on structural alignment and risk parameters.

---

## 📊 Component Correlation Table

Each component is mapped and classified into one of six correlation categories:
- **DIRECT MATCH:** Code structure and properties align perfectly with Figma design components.
- **PARTIAL MATCH:** React component exists but lacks design token binds or possesses custom inline stylings.
- **FRAGILE MATCH:** Component layout adjustments risk breaking critical print outputs or coordinate tracking scripts.
- **UNMAPPED:** Implemented codebase widget has no registry metadata block linking it to Figma.
- **PROTECTED:** Core operational flow widget. Must be shielded from direct automated modifications.
- **BLOCKED:** Component is tied to database states or security middleware, preventing direct visual alignments.

| React Component | File Path | Figma Node ID | Correlation Category | Notes / Analysis |
| :--- | :--- | :--- | :--- | :--- |
| **StatusBadge** | `src/design-system/components/StatusBadge.tsx` | `node-id=101:4` | **DIRECT MATCH** | Direct token binding. High styling parity. |
| **PriorityBadge** | `src/design-system/components/PriorityBadge.tsx` | `node-id=102:5` | **DIRECT MATCH** | Direct token binding. High styling parity. |
| **OfflineSyncIndicator** | `src/design-system/components/OfflineSyncIndicator.tsx` | `node-id=205:12` | **DIRECT MATCH** | Clean read-only visual status. |
| **MobileBottomNavigation** | `src/design-system/components/MobileBottomNavigation.tsx` | `node-id=309:8` | **PROTECTED** | Sticky mobile footer. Sizing must not shrink below 48px. |
| **ServiceCallCard** | `src/modules/service_calls/components/ServiceCallCard.tsx` | `node-id=201:10` | **PARTIAL MATCH** | Passively aligned but StatusBadge colors are duplicated locally. |
| **DispatchKanbanCard** | `src/modules/service_calls/components/dispatch/DispatchCard.tsx` | `node-id=201:11` | **PARTIAL MATCH** | Styling is coupled with inline drop event handlers. |
| **NewServiceCallForm** | `src/modules/service_calls/components/NewServiceCallForm.tsx` | `node-id=501:5` | **UNMAPPED** | Missing from registry configurations. Spacings are inlined. |
| **PartsSection** | `src/modules/service_calls/components/PartsSection.tsx` | `node-id=205:44` | **UNMAPPED** | Missing from registry. Custom grid paddings. |
| **SignatureSection** | `src/modules/service_calls/components/SignatureSection.tsx` | `node-id=302:10` | **FRAGILE MATCH** | Drawing pad gestures are vulnerable to layout resizing. |
| **PhotosSection** | `src/modules/service_calls/components/PhotosSection.tsx` | `node-id=302:11` | **PARTIAL MATCH** | Flex layouts are wrapped inline. |
| **MachineHistorySection** | `src/modules/service_calls/components/MachineHistorySection.tsx` | `node-id=302:12` | **UNMAPPED** | Timelines circles require touch target checks. |
| **DispatchBoard** | `src/modules/service_calls/components/dispatch/DispatchBoard.tsx` | `node-id=201:12` | **BLOCKED** | Highly coupled to drag-and-drop state machines. |
| **PDFReportPreview** | `#pdf-print-template` in detail page | — | **BLOCKED** | Printing canvas container. Absolutely locked. |

---

## 🟢 Safe Future Alignment Candidates

The following components represent low-risk, safe candidates for the first active design token alignment:
- **`StatusBadge` & `PriorityBadge`:** Easy HSL colors variables synchronization.
- **`OfflineSyncIndicator`:** Simple layout spacing alignment.
- **`DSFormSection` & `DSLabel`:** Reconciling basic grid gutters and typographies.

---

## ❌ Blocked Alignment Zones

No active design synchronization may be executed within these zones:
- **`src/middleware.ts`:** Governs security guards and user session validations.
- **`#pdf-print-template`:** Print layouts utilizing standard fonts and off-screen parameters.
- **`SignatureSection` Canvas:** Drawing canvas variables and touch gesture coordinates.

---

## 📂 Reference Guidelines
- **Token Correlation:** [docs/DESIGN_TOKEN_CORRELATION_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TOKEN_CORRELATION_AUDIT.md)
- **Component Mapping Registry:** [docs/COMPONENT_MAPPING_REGISTRY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_MAPPING_REGISTRY.md)
- **UI Inconsistency Tracker:** [docs/UI_INCONSISTENCY_TRACKER.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_INCONSISTENCY_TRACKER.md)
- **Future Alignment Plan:** [docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
