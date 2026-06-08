# DSBadge Future Expansion Readiness - Welo Platform SaaS

This document establishes the DSBadge Future Expansion Readiness for Welo Platform. It evaluates the component's stability, determines safety levels across subsystems, lists blocked areas, and outlines the safest phased rollout roadmap.

---

## 🚦 Future Readiness Evaluation

| Subsystem | Readiness Status | Safety Level | Evaluation Findings |
| :--- | :--- | :--- | :--- |
| **Mobile-Critical Screens** | **Ready** | **High** | The component utilizes flex-wrap bounds and `shrink-0` to avoid layout overflows. Font scale of `10px` is highly readable. |
| **Dispatcher Board** | **Pending** | **Medium** | Stable for static views, but requires caution. Wrapping badges with drag-and-drop triggers can cause event bubbling issues. |
| **PDF Rendering Templates** | **Blocked** | **Low** | html2canvas does not support transparent alpha backgrounds (`bg-*/10`) reliably. May cause rendering blackouts or invisible text. |

---

## 🚫 Blocked Implementation Zones

To prevent regressions, the following modules must remain **strictly blocked** from using `DSBadge` until subsequent stabilization tasks are completed:

1. **Detailed PDF Export Layouts:**
   - Any badge rendering inside `#pdf-print-template` must remain plain text table cells.
   - Do not replace print text labels with the `DSBadge` primitive.
2. **Kanban Card Dropdown Mutators:**
   - Drag-and-drop column card containers in `/dashboard/dispatch` must keep their local select menus.
   - Do not replace interactive status selector tags with nested `DSBadge` components.
3. **Database Mutation Flows:**
   - The badge must remain a pure visual abstraction. Do not include database update logic inside the component.

---

## 📅 Safest Rollout Roadmap

Once tokens are consolidated, future migrations must follow this safety-first rollout order:

```
[Phase 1: Token Declaration] ➔ [Phase 2: Secondary Lists] ➔ [Phase 3: Detail Pages] ➔ [Phase 4: Dispatch Board]
```

### Phase 1: Global CSS Token Declaration
- **Status:** **Completed.** `--radius-sm` and HSL status colors are fully declared inside [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css), removing fallback dependencies.

### Phase 2: Secondary View Lists
- **Action:** Replace status badges inside the secondary read-only lists:
  - Settings page logs.
  - Archive lists page.

### Phase 3: Detail Page Widgets
- **Action:** Integrate `DSBadge` inside the Service Call detail page header (excluding print templates), replacing standalone `StatusBadge` and `PriorityBadge` imports.

### Phase 4: Dispatch Board Read-Only Cards
- **Action:** Refactor Kanban dispatcher card priorities to use `<DSBadge category="priority" />` once drag-and-drop event bubble safety is validated.
