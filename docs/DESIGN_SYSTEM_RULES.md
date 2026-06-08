# Design System Rules - Welo Platform SaaS

This document establishes the official Design System Rules, tokens, and standards for the Welo Platform. All UI changes, styling implementations, and frontend components must strictly adhere to these guidelines to ensure consistency, accessibility, and high visual standards.

---

## 📐 Typography Standards

Welo Platform has standardized its typography to ensure professional legibility and clean UI transitions across web and mobile viewports.

- **Primary Font Family:** **Inter** (`Inter, system-ui, -apple-system, sans-serif`)
  - *Reasoning:* Standardized in Figma mockups, optimizes readability for data-rich enterprise SaaS, provides better alignment across teams, and supports long-term UI stability.
- **Font Scale & Hierarchy:**
  - **`h1` / Display Title:** `2.25rem` (`36px`) | Line height: `1.2` | Semibold (`600`)
  - **`h2` / Section Head:** `1.5rem` (`24px`) | Line height: `1.3` | Semibold (`600`)
  - **`h3` / Subsection:** `1.125rem` (`18px`) | Line height: `1.4` | Medium (`500`)
  - **Body / Main Text:** `0.875rem` (`14px`) | Line height: `1.5` | Regular (`400`)
  - **Small / Metadata:** `0.75rem` (`12px`) | Line height: `1.5` | Regular (`400`)

---

## 🎨 Color Palette & Tokens (HSL Mapping)

To support dark-mode sync and premium visual aesthetics, all colors must be referenced using HSL CSS Custom Properties. Never hardcode HEX or HSL values directly in component files.

| Custom Property | Light Mode HSL | Dark Mode HSL | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `0 0% 98%` (`#fafafa`) | `220 40% 6%` (`#090d16`) | Main screen background |
| `--foreground` | `222 47% 11%` (`#0f172a`) | `210 40% 98%` (`#f8fafc`) | Primary text |
| `--card-bg` | `0 0% 100%` (`#ffffff`) | `224 71% 4%` (`#111827`) | Panels and cards |
| `--card-border` | `222 47% 11% / 0.08` | `0 0% 100% / 0.06` | Subtle dividers and borders |
| `--primary` | `192 91% 36%` (`#0891b2`) | `188 86% 53%` (`#22d3ee`) | Primary buttons and interactive highlights |
| `--primary-hover` | `192 82% 25%` (`#0e7490`) | `188 86% 69%` (`#67e8f9`) | Hover state for primary actions |
| `--accent` | `239 84% 67%` (`#6366f1`) | `239 84% 67%` (`#6366f1`) | Secondary callouts and branding accents |
| `--accent-light` | `239 84% 67% / 0.1` | `239 84% 67% / 0.1` | Transparent pill/badge background |

---

## 📱 Mobile-First & Responsive Standards

To accommodate both dispatcher desktop monitoring and technician mobile workflows, all layout development must be **mobile-first**.

### Mobile-First Mandatory Rules
1. **Media Queries:** Write basic styles for mobile viewports *first*, and add responsive media queries scaling up to larger viewports.
   ```css
   /* Correct Mobile-First approach */
   .grid-container {
     display: grid;
     grid-template-columns: 1fr; /* Single column on mobile */
     gap: 1rem;
   }
   
   @media (min-width: 768px) {
     .grid-container {
       grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
     }
   }
   
   @media (min-width: 1200px) {
     .grid-container {
       grid-template-columns: repeat(4, 1fr); /* 4 columns on desktop */
     }
   }
   ```
2. **Breakpoints Table:**
  - **Mobile:** `320px` to `480px`
  - **Tablet:** `768px` to `1024px`
  - **Desktop:** `1200px+`

### Touch-First Interaction Requirements
- **Touch Target Size:** Interactive elements (buttons, links, form inputs) must have a minimum touch target size of **44x44px** to ensure usability on mobile screens.
- **Spacing:** Maintain a minimum of `8px` spacing between distinct clickable elements to prevent accidental triggers.
- **Interactive Feedback:** Always declare `:active` and touch highlight overrides (`-webkit-tap-highlight-color: transparent`) to ensure responsive UI feel.
- **Scroll Physics:** Mobile lists must have smooth physics (`overflow-y: auto`, `-webkit-overflow-scrolling: touch`).

### Responsive Testing Checklist
- [ ] UI tested on simulated viewport widths of `320px`, `375px`, `768px`, and `1440px`.
- [ ] No horizontal overflow or layout break occurs at any intermediate viewport sizes (fluid scaling).
- [ ] Grid layouts wraps cleanly without truncated text or overlapping items.
- [ ] Text fields and selectors do not trigger automatic zooming on iOS Safari (font-size must be at least `16px` or `1rem` on inputs to prevent this).

---

## ♿ Accessibility (a11y) & Interactive Standards

All UI components must support clean keyboard traversal and screen reader integration.

### Focus-Visible Standards
- Do not remove the default browser focus outline without replacing it.
- Use the `:focus-visible` pseudo-class to only show focus rings for keyboard users.
- Apply high-contrast focus rings:
  ```css
  button:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  ```

### Keyboard Navigation Requirements
- Every interactive element must be reachable using the `Tab` key.
- Custom dropdowns, modals, and tabs must listen for and support `ArrowKeys`, `Esc`, and `Enter` inputs.
- Modals must implement active focus-trapping.

### Reduced-Motion Support
- Respect user OS choices regarding system animations. Provide fallback transitions:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

### Screen Reader Compatibility
- Use Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`).
- If using icon-only buttons, provide an `aria-label` or `.sr-only` descriptive label (e.g. `aria-label="Close modal"`).
- Dynamic components (like loading states, banners, or toast alerts) must use `aria-live="polite"` or `aria-live="assertive"` to announce status updates.

---

## 🔄 Governance Alignment

- **Aesthetics & Premium Elements:** All components must maintain modern visual accents (e.g., subtle HSL-based transitions, smooth cubic-bezier fades, glassmorphism card styles, and fluid flex containers).
- **Rule Changes:** Modification of these design standards must be coordinated with the product team and documented in the repository readme or configuration files.
