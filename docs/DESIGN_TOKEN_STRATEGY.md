# Design Token Strategy - Welo Platform SaaS

This document establishes the Design Token strategy to allow structured, automated sync from Figma Dev Mode variables to CSS variables in Next.js.

---

## 🎨 Token Categories & Definitions

All tokens must map to CSS custom properties inside `globals.css` to allow theming, dark mode compatibility, and scalable overrides.

### 1. Colors & HSL Values
Colors must be expressed in HSL format for smooth opacity blending (`rgba` equivalents) and runtime modifications.
- **`--background`**: `0 0% 98%` (Light) | `220 40% 6%` (Dark)
- **`--foreground`**: `222 47% 11%` (Light) | `210 40% 98%` (Dark)
- **`--card-bg`**: `0 0% 100%` (Light) | `224 71% 4%` (Dark)
- **`--card-border`**: `222 47% 11% / 0.08` | `0 0% 100% / 0.06`
- **`--primary`**: `192 91% 36%` (Light) | `188 86% 53%` (Dark)
- **`--accent`**: `239 84% 67%` (Light/Dark)

### 2. Status Colors (Operational Feedback)
For critical operational status indicators across lists and cards.
- **`--status-pending`**: `38 92% 50%` (Orange) | Alert states / new dispatch calls
- **`--status-active`**: `192 91% 36%` (Cyan) | Active technician on-site
- **`--status-completed`**: `142 76% 36%` (Green) | Completed/signed-off workorders
- **`--status-blocked`**: `0 84% 60%` (Red) | Broken parts/missing items

### 3. Spacing Scale
Prohibits custom layout margins. Spacing conforms to a fluid 8pt base grid.
- **`--space-xs`**: `0.25rem` (`4px`)
- **`--space-sm`**: `0.5rem` (`8px`)
- **`--space-md`**: `1rem` (`16px`)
- **`--space-lg`**: `1.5rem` (`24px`)
- **`--space-xl`**: `2rem` (`32px`)

### 4. Typography Hierarchy
Official font is **Inter**. Standard CSS classes map directly to these variables.
- **`--font-size-sm`**: `0.75rem` (`12px`) | Line-height: `1.5`
- **`--font-size-base`**: `0.875rem` (`14px`) | Line-height: `1.5`
- **`--font-size-md`**: `1.125rem` (`18px`) | Line-height: `1.4`
- **`--font-size-lg`**: `1.5rem` (`24px`) | Line-height: `1.3`
- **`--font-size-xl`**: `2.25rem` (`36px`) | Line-height: `1.2`

### 5. Radii (Rounded corners)
- **`--radius-sm`**: `0.25rem` (`4px`) | Badges, small inputs
- **`--radius-md`**: `0.5rem` (`8px`) | Form fields, action buttons
- **`--radius-lg`**: `1rem` (`16px`) | Component cards, modal panels
- **`--radius-xl`**: `1.5rem` (`24px`) | Large overlays, detail panels

### 6. Shadows & Depth
- **`--shadow-sm`**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **`--shadow-md`**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **`--shadow-lg`**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

### 7. Z-Index Layers (Depth Isolation)
- **`--z-index-base`**: `1`
- **`--z-index-sticky`**: `100` | Table headers, navigation tabs
- **`--z-index-drawer`**: `500` | Mobile side menus, modal sheets
- **`--z-index-modal`**: `1000` | Critical confirm prompts
- **`--z-index-toast`**: `2000` | Event status notifications

### 8. Animation Timings (Transitions)
- **`--transition-fast`**: `150ms cubic-bezier(0.4, 0, 0.2, 1)` | Hover triggers, fade-in
- **`--transition-normal`**: `250ms cubic-bezier(0.16, 1, 0.3, 1)` | Modals, drawer slides

### 9. Interactive Touch Target Scale
- **`--touch-target-min`**: `44px` (Minimum tap target width and height)
- **`--touch-spacing-min`**: `8px` (Minimum spacing between distinct touch targets)

---

## 🔄 Tokens synchronization structure

```
[Figma Variables API] ➔ [Extract HSL JSON] ➔ [Local variables.css compile]
```

- Raw token edits must first happen in the Figma Variables library.
- When sync is run, the JSON payload compiles to local CSS variables in `src/styles/variables.css`, which is imported directly into `app/globals.css`.
- The compilation script validates that color codes are mapped to variable HSL keys.
