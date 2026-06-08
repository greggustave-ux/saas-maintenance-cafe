# DSBadge Mobile Behavior Audit - Welo Platform SaaS

This document establishes the DSBadge Mobile Behavior Audit for Welo Platform. It evaluates touch safety rules, text wrapping behaviors, container heights, and viewport constraints on mobile-critical layouts.

---

## 📱 Mobile Layout & Viewport wrapping

### 1. Timeline Flex Wrapping
- **Observation:** In [MachineHistorySection.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/MachineHistorySection.tsx), status badges are rendered inside the header block of timeline items:
  ```tsx
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
      <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          {/* Reference and Date */}
          <DSBadge category="status" variant={item.status} className="shrink-0" />
      </div>
  </div>
  ```
- **Behavior:** On viewport widths under `360px` (e.g. mobile devices), the parent container uses `flex-wrap` and `min-w-0`. This forces the status badge to wrap below reference numbers instead of clipping, preventing horizontal scrollbars.
- **Safety Rule:** Every mobile-safe card containing badges must use `flex-wrap` on the header flex row to accommodate translation length changes.

### 2. Layout Shift Prevention
- **Observation:** The component specifies fixed font dimensions `text-[10px] font-bold` and static vertical paddings `py-0.5`.
- **Behavior:** This ensures that whether rendering `new` (3 characters) or `waiting_parts` (21 characters), the badge height remains constant at `20px` (line-height + padding + borders). This prevents layout reflows (Layout Shift) when loading dynamic statuses.

---

## ♿ Mobile Tap Targets & Interactive Safety

### 1. Non-Interactive Status Display
- **Rule:** The badge itself is static (`span`). It is safe from accidental tap triggering on mobile timelines because it is not interactive.
- **Pre-existing Select Menus:** On other pages (like service call listings), badges are sometimes styled inside HTML `<select>` triggers.
- **Interaction Risk:** If these dropdown triggers are too small, users will struggle to select them on mobile, activating adjacent links instead.
- **Safety Standard:** When wrapping interactive menus around badge styles, developers must enforce a tap target size of at least **`44px x 44px`** using invisible outer paddings, as detailed in [docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md).

---

## ⚙️ Mobile Density Guidelines

- **Badge Wrapping:** Avoid placing multiple status badges next to each other on the same card row on mobile.
- **Spacing:** Enforce a minimum gap of `gap-2` (8px) between badges and adjacent text labels to prevent visual crowding.
