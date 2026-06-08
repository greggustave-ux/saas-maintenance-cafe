# Safe Alignment Zones - Welo Platform SaaS

This document defines the safe visual styling layers, components, and layout attributes that can be aligned with the Figma mockup. All changes within these zones must strictly adhere to the project's design system tokens and avoid affecting interactive code.

---

## 🎨 Safe Visual Styling Layers

To protect the application's layout, visual alignment updates must consume centralized CSS custom properties (variables) declared in [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css). Hardcoded values or custom inline styling rules are strictly forbidden.

### 1. Typography Mappings
- **Safe Adjustments:** Adjusting font weights (`font-medium`, `font-semibold`), letter spacing (`tracking-tight`), and line heights (`leading-relaxed`) for standard headers (`h1`, `h2`, `h3`) and static list details.
- **Strict Rules:** 
  - Standard system font stacks (`var(--font-sans)`) must remain active. Do not import external custom fonts.
  - Text sizing must consume design system variables (e.g., `text-sm`, `text-lg` mappings in `@theme`).

### 2. Layout Spacing and Margin Variables
- **Safe Adjustments:** Standardizing internal list margins (`gap-2` to `gap-4`) and container padding (`p-3` to `p-5`) in secondary dashboards.
- **Strict Rules:**
  - Layout spacing must use standard spacing tokens (e.g. `var(--spacing-4)` / `1rem`).
  - Spacing changes must not reduce interactive touch dimensions. Elements like buttons and select selectors must preserve at least `min-h-11` (`44px`) targets.

### 3. Corner Radius and Borders
- **Safe Adjustments:** Standardizing card corner rounding (`rounded-[var(--radius-md)]` or `rounded-[var(--radius-lg)]`) and border style scales.
- **Strict Rules:**
  - Corner values must map to `--radius-sm` (4px), `--radius-md` (8px), or `--radius-lg` (12px).
  - Borders must use standard neutral color variables (`border-neutral-200` or HSL token values).

---

## 📋 Approved Pages for Safe Alignment

The following page zones are cleared for styling updates, provided they only use global token styles:

1. **Service Call Archives Page:**
   - **Route:** `/dashboard/service-calls/archives`.
   - **Approved Elements:** List grid alignment, card wrapper border radius, card margins, and header typography tracking.
2. **Clients Directory Page:**
   - **Route:** `/dashboard/clients`.
   - **Approved Elements:** Padding between directory listings, border colors of client cards, and client metadata label weights.
3. **Technicians Index Page:**
   - **Route:** `/dashboard/technicians`.
   - **Approved Elements:** Table cell padding alignments and secondary user avatar rounding values.
