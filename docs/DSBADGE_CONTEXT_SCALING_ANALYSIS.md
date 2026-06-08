# DSBadge Context Scaling Analysis - Welo Platform SaaS

This document establishes the DSBadge Context Scaling Analysis for Welo Platform. It evaluates rendering density, spacing inheritance, text wrapping, and mobile viewport adaptability when migrating the second integration candidate.

---

## 📐 Layout Scaling & Density Analysis

### 1. Flex Row Spacing inside Cards
- **Observation:** In `ServiceCallCard.tsx`, the priority badge renders nested inside a flex container next to reference numbers:
  ```tsx
  <div className="flex items-center gap-[var(--space-xs)] flex-wrap">
      {call.reference_number && (
          <span className="text-[var(--font-size-sm)] font-bold font-mono tracking-wider text-[var(--primary)] uppercase">
              {call.reference_number}
          </span>
      )}
      <PriorityBadge priority={safePriority} className="text-[9px]" />
  </div>
  ```
- **Density Impact:** The gap is controlled by `gap-[var(--space-xs)]` (which resolves to `0.25rem` or `4px` in default setups).
- **Scaling Recommendation:** Swapping `PriorityBadge` for `DSBadge` must maintain the identical `className="text-[9px]"` or a small font constraint to prevent the badge from pushing adjacent titles downwards.

### 2. Typography & Font Uniformity
- **Observation:** The legacy `PriorityBadge` declares `font-bold` and uses the default font family mapping from `globals.css` (sans-serif).
- **Inheritance:** `DSBadge` specifies `font-bold text-[10px]` by default but forwards overrides.
- **Scaling Recommendation:** The className `text-[9px]` overrides the default `text-[10px]` size. This ensures the font size matches the exact height bounds of the legacy badge rendering, keeping the layout perfectly identical.

---

## 📱 Mobile Adaptability & Wrapping

### 1. Narrow Screen Flex Wrapping
- **Viewport Constraints:** On mobile devices (viewports down to `320px`), reference numbers and priority badges render next to each other.
- **Wrap Safeguard:** The container utilizes `flex-wrap`. If a long reference number is rendered alongside a badge, the badge wraps smoothly without triggering card clip-offs.
- **Verification Rule:** Verify that wrapping does not introduce unwanted height shifts or overlapping with the client link below it (`client_name`).
