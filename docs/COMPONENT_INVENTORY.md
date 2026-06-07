# Component Inventory - Welo Platform SaaS

This document catalogues the frontend components discovered in the Welo Platform SaaS workspace. It details reusable UI components, registers unmapped files, highlights fragile or duplicated styling, and lists mobile-sensitive elements.

---

## 📦 Component Classification

Based on a passive directory scan of `src/design-system` and `src/modules`, components are grouped below:

### 1. Shared Design System Components (Forms)
These components reside under [src/design-system/components/forms](file:///c:/Users/Dylan/Documents/welo_platform/src/design-system/components/forms) and provide standardized inputs.
- **`DSFormSection.tsx`:** Renders wrapper containers with standard spacing gutters.
- **`DSInput.tsx`:** Standard input with `min-h-12` constraints.
- **`DSLabel.tsx`:** Associated accessible text label.
- **`DSSelect.tsx`:** Custom select dropdown aligned with design system parameters.
- **`DSTextarea.tsx`:** Resizable input area.
- **`DSValidationMessage.tsx`:** Field error message container.

### 2. Shared Design System Components (Core)
These components reside under [src/design-system/components](file:///c:/Users/Dylan/Documents/welo_platform/src/design-system/components).
- **`StatusBadge.tsx`:** Renders colored badges based on service call state.
- **`PriorityBadge.tsx`:** Highlights urgent/high-priority items.
- **`OfflineSyncIndicator.tsx`:** Banner displaying network sync states.
- **`MobileBottomNavigation.tsx`:** Bottom navbar for mobile viewport views.

### 3. Business Feature Components
These components reside under [src/modules/service_calls/components](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components) and govern operations.
- **`ServiceCallCard.tsx`:** Renders summary views of service calls.
- **`NewServiceCallForm.tsx`:** Modal form for adding new service calls.
- **`PartsSection.tsx`:** Renders parts lists and quantity inputs.
- **`PhotosSection.tsx`:** Manages photo uploads and thumbnail displays.
- **`SignatureSection.tsx`:** Captures touch signatures.
- **`MachineHistorySection.tsx`:** Timelines past machine interventions.
- **`dispatch/DispatchBoard.tsx`:** Kanban drag-and-drop layout.
- **`dispatch/DispatchCard.tsx`:** Individual Kanban ticket item.
- **`dispatch/DispatchColumn.tsx`:** Kanban column container.

---

## 🔍 Unmapped Components Registry Status

A comparison between the active codebase and `src/design-system/registry/component-registry.ts` shows several business components are **not registered**:

| Component | File Path | Registry Status |
| :--- | :--- | :--- |
| `NewServiceCallForm` | `src/modules/service_calls/components/NewServiceCallForm.tsx` | ❌ Unregistered |
| `PartsSection` | `src/modules/service_calls/components/PartsSection.tsx` | ❌ Unregistered |
| `MachineHistorySection` | `src/modules/service_calls/components/MachineHistorySection.tsx` | ❌ Unregistered |
| `PhotosSection` | `src/modules/service_calls/components/PhotosSection.tsx` | ❌ Unregistered |
| `SignatureSection` | `src/modules/service_calls/components/SignatureSection.tsx` | ❌ Unregistered |
| `DispatchBoard` | `src/modules/service_calls/components/dispatch/DispatchBoard.tsx` | ❌ Unregistered |
| `DispatchColumn` | `src/modules/service_calls/components/dispatch/DispatchColumn.tsx` | ❌ Unregistered |

*Note: Unregistered components must be added to the registry before attempting automated design alignments to prevent syncing conflicts.*

---

## ⚠️ Fragile or Duplicated Elements

The passive analysis identified the following areas requiring consolidation:
1. **Admin User Dashboard ([app/admin/users/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/admin/users/page.tsx)):**
   - **Risk:** At 45.6 KB, this file contains complex admin actions, tables, layout headers, and confirm dialogs all written inline. Changing styling directly risks disrupting database state triggers (`admin_update_profile`).
2. **Service Call Details Page ([app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx)):**
   - **Risk:** At 47.9 KB, this page contains multiple overlay dialogs, skeleton templates, and a hidden off-screen print component (`#pdf-print-template`). Modifying container classes directly impacts the generated PDF format.
3. **Badges:**
   - **Risk:** The project uses `StatusBadge` and `PriorityBadge`, but some views still render inline spans with custom color mappings, presenting a styling drift risk.

---

## 📱 Mobile-Sensitive Elements

Four components require precise touch-target controls to ensure usability on mobile devices:
- **`SignatureSection`:** Captures HTML5 canvas drag events. Must intercept touch scrolling to prevent screen jumping while signing.
- **`MobileBottomNavigation`:** Fixed footer navigation. Touch heights must exceed `48px` to guarantee tap recognition.
- **`PhotosSection`:** Mobile upload camera interface. Button sizing must be clear.
- **`ServiceCallCard`:** Main touch-entry point to detailed pages. Must use flexible padding (`16px`) to prevent text overflow on narrow viewports.

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
