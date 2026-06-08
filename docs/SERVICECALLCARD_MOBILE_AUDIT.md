# ServiceCallCard Mobile Audit - Welo Platform SaaS

This document establishes the Mobile Audit guidelines and results for the `ServiceCallCard` layout migration. It validates the responsive wrapping safety and touch compliance on handheld screens down to `320px` width.

---

## 📱 Mobile Reflow & Viewport Verification

We validated card layouts under small-screen viewports (down to `320px` width):

### 1. Viewport Overflow Safety
- **Observation:** The card container uses flex vertical stacking (`flex flex-col justify-between`). 
- **Wrap Rules:** 
  - Header row elements wrap cleanly. The reference number and priority badges reflow above client names when titles expand.
  - Action buttons wrap or stretch relative to the card container width, avoiding horizontal scrolling.
- **Result:** **Pass.** Clean reflow on `320px` viewports.

### 2. Touch Target Compliances
- **Dropdown Status Selector:** Height is `min-h-[44px]` (via `min-h-[var(--touch-target-min)]`), ensuring easy selection for field technicians using thumb gestures.
- **Action Buttons:** Maintain a height of `44px` (`min-h-[var(--touch-target-min)]`) with a gap of `12px` (`var(--space-md)`) between elements.
- **Delete Button:** Touch zone is `44px` by `44px`.
- **Result:** **Pass.** 100% WCAG-compliant mobile tap targets.

---

## 🚦 Typography Wrapping Details

To safeguard data readability, the following typography limits are enforced:
- **Client Name:** Break-words logic (`break-words`) prevents overflow from long text values.
- **Serial Number:** Break-all logic (`break-all`) contains serial codes inside bounds.
- **Problem description:** Line clamping (`line-clamp-2`) prevents cards from stretching vertically due to long customer comments.
