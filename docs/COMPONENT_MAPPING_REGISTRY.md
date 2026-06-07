# Component Mapping Registry - Welo Platform SaaS

This document establishes the Component Mapping Registry for Welo Platform. It tracks the mappings between codebase components and Figma design node IDs, registers unmatched design modules, and identifies code components lacking design documentation.

---

## 📋 Mapped Components Registry

Below is the centralized registry of mapped components, matching the registrations in `src/design-system/registry/component-registry.ts`:

| Component ID | React File Location | Figma Node ID | Risk Tier | Verification Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **StatusBadge** | `src/design-system/components/StatusBadge.tsx` | `node-id=101:4` | **LOW** | Font size is 10px; HSL status colors must match CSS custom properties. |
| **PriorityBadge** | `src/design-system/components/PriorityBadge.tsx` | `node-id=102:5` | **LOW** | Rounded corners must map to `--radius-sm`. |
| **OfflineSyncIndicator**| `src/design-system/components/OfflineSyncIndicator.tsx`| `node-id=205:12`| **LOW** | Persistent block banner displays correct connection states. |
| **MobileBottomNavigation**| `src/design-system/components/MobileBottomNavigation.tsx`| `node-id=309:8`| **MEDIUM**| Touch area boundaries must exceed `48px x 64px`. |
| **ServiceCallCard** | `src/modules/service_calls/components/ServiceCallCard.tsx`| `node-id=201:10`| **MEDIUM**| Card layout padding equals `--space-md` (`16px`). |
| **DispatchKanbanCard**| `src/modules/service_calls/components/dispatch/DispatchCard.tsx`| `node-id=201:11`| **MEDIUM**| Grid layout adapts to mobile columns. |

---

## 🔍 Unmatched Codebase Components

The following codebase components exist and are utilized in Welo Platform workflows, but they **lack mappings** or registry records:
- **`MachineHistorySection`:** Renders chronological timeline items. Missing Node ID link.
- **`SignatureSection`:** Touch-sensitive signing canvas. Needs Figma wireframe node link.
- **`PhotosSection`:** Image upload grid wrapper. Needs Figma layout specs.
- **`PartsSection`:** Materials table and unit cost calculator. Needs grid mappings.
- **`NewServiceCallForm`:** Modal submission form. Needs input alignment node ID.
- **`DispatchBoard` & `DispatchColumn`:** Drag-and-drop structural components. Needs Kanban columns specifications.

---

## 🔍 Unmatched Figma Design Components

The following Figma design components exist in the design library, but **lack React implementations** in the codebase:
- **`ClientPortalPanel` (`node-id=402:1`)**: Proposed interface for client accounts; has no corresponding router views or pages in `/app/`.
- **`PartsFilterWidget` (`node-id=505:2`)**: Advanced search filters for inventory lists; no code exists.
- **`TimelineFilterToolbar` (`node-id=302:22`)**: Sorting parameters for repair timelines; no code exists.

---

## 📂 Reference Guidelines
- **Figma to Component Correlation:** [docs/FIGMA_TO_COMPONENT_CORRELATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_TO_COMPONENT_CORRELATION.md)
- **Token Correlation:** [docs/DESIGN_TOKEN_CORRELATION_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TOKEN_CORRELATION_AUDIT.md)
- **UI Inconsistency Tracker:** [docs/UI_INCONSISTENCY_TRACKER.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_INCONSISTENCY_TRACKER.md)
- **Future Alignment Plan:** [docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
