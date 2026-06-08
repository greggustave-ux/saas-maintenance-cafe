# DSBadge Second Integration Risk Matrix - Welo Platform SaaS

This document establishes the DSBadge Second Integration Risk Matrix for Welo Platform. It classifies the potential risks, visual regressions, layout shift hazards, and subsystem conflicts associated with the second integration target.

---

## ⚡ Risk Classification & Mitigation Matrix

| Risk ID | Regression / Risk Area | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | **Layout Shift (Card List):** Changing badge dimensions shifts rows in lists. | Medium | Low | Force font override `className="text-[9px]"` to retain identical padding/line-height bounds. |
| **RSK-02** | **Dispatcher Board Drift:** Unintended modification of components shared with Kanban cards. | High | Low | Lock all files inside `src/modules/service_calls/components/dispatch/` from changes. |
| **RSK-03** | **PDF Layout Breakage:** Print report rendering suffers margins misalignment. | High | Low | Strictly exclude print templates in `app/dashboard/service-calls/[id]/page.tsx` from refactoring. |
| **RSK-04** | **Mobile Touch Accidental Tap:** Click targets trigger parent links or drag hooks. | Medium | Low | Ensure the badge remains static inside the list header. Maintain separation between badge and adjacent touch elements. |

---

## 🛑 Subsystem Boundary Rules

1. **Kanban Card Isolation:**
   - Although `DispatchCard.tsx` renders identical priorities, it is part of the drag-and-drop dispatcher view. This file is **strictly blocked** from modifications.
2. **Detail Page PDF Isolation:**
   - `app/dashboard/service-calls/[id]/page.tsx` contains active signature triggers and the printable A4 print box. This page remains **blocked** from changes.
3. **Database Mutation Safety:**
   - The refactored badge has no callbacks that trigger state mutations or database changes.
