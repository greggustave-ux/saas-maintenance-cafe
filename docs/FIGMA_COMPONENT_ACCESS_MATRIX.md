# Figma Component Access Matrix - Welo Platform SaaS

This document establishes the Figma Component Access Matrix for the Welo Platform. It defines the allowed metadata and safety thresholds for components during passive Figma inspections.

---

## 📊 Component Access Matrix

The table below catalogs which components can be passively audited in Figma and sets their boundaries:

| Component Name | Figma Node Mapping | Access Scope | Allowed Metadata Fields | Safety Thresholds |
| :--- | :--- | :--- | :--- | :--- |
| **StatusBadge** | `node-id=101:4` | Read-Only | colors, typography, border-radius | Contrast ratio must exceed WCAG 2.1 AA (`>= 4.5:1`). |
| **PriorityBadge** | `node-id=102:5` | Read-Only | colors, font-weight | Border width must not shrink below 1px. |
| **OfflineSyncIndicator** | `node-id=205:12` | Read-Only | colors, spacing | Spacing margins must equal `--space-sm`. |
| **MobileBottomNavigation** | `node-id=309:8` | Read-Only | heights, spacings, flex-direction | Click heights must equal or exceed **`48px`**. |
| **ServiceCallCard** | `node-id=201:10` | Read-Only | colors, widths, grid-gap | Card width must be fluid; margins must equal `16px`. |
| **DispatchKanbanCard** | `node-id=201:11` | Read-Only | shadows, radius, font-size | Cards must wrap text blocks to prevent clippings. |
| **NewServiceCallForm** | `node-id=501:5` (Unmapped) | Restricted | grid spacing, inputs alignment | Must use standard form field components (`DSInput`). |
| **PartsSection** | `node-id=205:44` (Unmapped) | Restricted | font-sizes, list paddings | Table borders must use HSL custom colors. |
| **SignatureSection** | `node-id=302:10` (Unmapped) | Restricted | canvas heights, button borders | Drawing zone must exceed **`150px`** in height. |
| **PhotosSection** | `node-id=302:11` (Unmapped) | Restricted | grid-cols, thumbnail border-radius | Thumbnail grids must support fluid wrapping rules. |
| **MachineHistorySection**| `node-id=302:12` (Unmapped) | Restricted | spacing, timelines lines | Circle touch indicators must equal or exceed **`44px`**. |
| **DispatchBoard** | `node-id=201:12` (Unmapped) | Restricted | column-widths, scroll-gaps | Kanban columns must support horizontal overflows. |

---

## 🔒 Critical Access Rules

To prevent regressions, the following design properties are locked in place:
1. **Interactive Tap Heights:** Any element identified as clickable (e.g. `MobileBottomNavigation` tabs or action buttons) must enforce heights of **`>= 48px`** in Figma variables, matching CSS bounds.
2. **Standard Spacing Gutter:** Grid gaps in forms (`NewServiceCallForm`) are restricted to spacing tokens (`--space-sm` or `--space-md`). Custom margins are blocked.
3. **Typography Scaling:** Text elements must bind to the standard type collections in Figma, preventing inline font size overrides.

---

## 📂 Reference Guidelines
- **Figma Read-Only Governance:** [docs/FIGMA_READ_ONLY_GOVERNANCE.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_READ_ONLY_GOVERNANCE.md)
- **Inspection Boundaries:** [docs/FIGMA_INSPECTION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_BOUNDARIES.md)
- **Inspection Audit Rules:** [docs/FIGMA_INSPECTION_AUDIT_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_AUDIT_RULES.md)
- **Emergency Stop Protocol:** [docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md)
- **First Passive Inspection:** [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md)
- **Inspection Approval Flow:** [docs/MCP_INSPECTION_APPROVAL_FLOW.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_INSPECTION_APPROVAL_FLOW.md)
- **PDF UI Protection:** [docs/PDF_UI_PROTECTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PDF_UI_PROTECTION_RULES.md)
- **Mobile Critical Interactions:** [docs/MOBILE_CRITICAL_INTERACTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_CRITICAL_INTERACTION_RULES.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
