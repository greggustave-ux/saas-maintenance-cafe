# DSCard Visual Alignment Report - Welo Platform SaaS

This document establishes the Visual Alignment Report comparing the styling specifications from the read-only Figma mockup card frame against the Welo Platform production CSS codebase.

---

## 🎨 Design Specification Comparisons

### 1. Spacing and Container Padding
- **Figma Target Specification:** Auto-layout spacing of `16px` (`1rem`) on horizontal and vertical gutters.
- **Current Codebase Implementation:** Inconsistent padding classes (`p-4.5` on Machine History cards, `p-[var(--space-md)]` on Service Call Cards).
- **Alignment Action:** Map standard padding to `p-[var(--space-md,1rem)]` inside `DSCard`.

### 2. Corner Radius
- **Figma Target Specification:** Smooth corner rounding of `16px` (`1rem`).
- **Current Codebase Implementation:** Container elements use `rounded-2xl` (16px in Tailwind CSS) or `rounded-[var(--radius-lg)]` (16px).
- **Alignment Action:** Declare `--radius-lg: 1rem;` and `--radius-md: 8px;` inside the root CSS custom variables if they are missing, ensuring `rounded-[var(--radius-lg)]` resolves correctly on all browsers.

### 3. Surface Contrast & Color Hierarchy
- **Figma Target Specification:** 
  - Light mode: White surface (`#ffffff`) with thin subtle borders (`rgba(15,23,42,0.08)`).
  - Dark mode: Dark slate surface (`#111827`) with translucent border (`rgba(255,255,255,0.06)`).
- **Current Codebase Implementation:** Match is highly aligned because variables `--card-bg` and `--card-border` are already declared under `:root` and `@media (prefers-color-scheme: dark)` inside [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
- **Alignment Action:** Retain surface-contrast HSL variable lookups inside the new component.

### 4. Shadow Depth
- **Figma Target Specification:** Extremely subtle elevation drop-shadow.
- **Current Codebase Implementation:** Cards use `shadow-[var(--shadow-sm)]` or `shadow-xs`.
- **Alignment Action:** Standardize on `shadow-[var(--shadow-sm)]` for cards, transitioning to `shadow-[var(--shadow-md)]` on hover if hoverable animations are enabled.

---

## 🚦 Visual Parity Tolerance Statement

Pursuant to the **Visual Parity Tolerance Rule**:
- Perfect pixel-by-pixel matching is **not** required if layout modifications improve mobile usability.
- Card padding can be adjusted to `p-[var(--space-sm)]` (12px) on narrow mobile screen viewports (below `480px` width) to ensure text does not overflow adjacent margins.
- Surface color contracts must respect WCAG AA guidelines (maintaining at least `4.5:1` contrast for texts over card backgrounds).
