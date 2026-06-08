# DSCard Mobile Behavior Validation - Welo Platform SaaS

This document establishes the Mobile Behavior Validation guidelines for the new `DSCard` component. It outlines the testing gates, viewport specifications, and accessibility thresholds required to protect mobile technician operational flows.

---

## 📱 Mobile Viewport Verification Specs

Every card implementation must be validated across key mobile device widths down to `320px` (e.g. iPhone SE):

### 1. Viewport Range Checks
- **Small Phone Viewport (`320px` to `480px`):**
  - Verify that no horizontal scrolling is introduced on card lists.
  - Verify that card borders do not clip against the outer viewport margin.
- **Tablet / Responsive Viewports (`768px` to `1024px`):**
  - Verify that multi-column flex containers wrap cleanly (e.g. from 2-column card grids to 1-column mobile lists).

### 2. Tap Target Verification
- **Target Size Rule:** All interactive elements embedded inside a `DSCard` (such as status selectors, click triggers, action buttons, and detail links) must maintain an active touch dimension of at least **`44px`** (`min-h-11`).
- **Gaps:** Ensure buttons have a minimum distance of `8px` (`gap-2`) between them to prevent accidental dual taps on handheld touch screens.

---

## 🎨 Accessibility & Contrast Gates

- **Contrast Compliance:** Foreground text against the card surface must meet the WCAG AA minimum contrast ratio of **`4.5:1`**.
  - In Light Mode: text color `var(--foreground)` (#0f172a) over card background `var(--card-bg)` (#ffffff) exceeds `10:1` contrast.
  - In Dark Mode: text color `var(--foreground)` (#f8fafc) over card background `var(--card-bg)` (#111827) exceeds `12:1` contrast.
- **Keyboard Navigation Focus:** Cards containing links or action buttons must render a clear focus ring outline (using Tailwind's `focus:outline-none focus:ring-2 focus:ring-cyan-500`) when tabbed.

---

## ⚡ Flex-Wrap & Overflow Safeties

To prevent data truncation on narrow mobile screens, enforce these layout settings:
- **Badge Wrapping:** Avoid placing multiple status or priority badges inside a non-wrapping row. Use the `flex-wrap` and `gap-1.5` classes to allow badges to wrap smoothly.
- **Ellipsis Controls:** Titles and user names must use the `truncate` or `line-clamp-1` class. Long paragraphs must wrap using `break-words`.
