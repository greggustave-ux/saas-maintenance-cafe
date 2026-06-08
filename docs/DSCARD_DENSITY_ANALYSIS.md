# DSCard Density Analysis - Welo Platform SaaS

This document establishes the spacing and density guidelines for the `DSCard` component. It defines limits for vertical padding, container spacing, and grid gutters to prevent layouts from overflowing on small viewports.

---

## 📊 Layout Density Risk Audit

When displaying multiple cards in lists or dashboards, excessive padding accumulates vertical height rapidly. We audited target views to define density rules:

### 1. Card Padding Scaling Rules
To maintain data density, select padding values based on the target context:
- **`padding="sm"` (12px):** Approved for nested cards, list row elements, and mobile timeline cards where vertical space is constrained.
- **`padding="md"` (16px):** Approved for standard dashboards, stats grids, and service call cards on viewports above `768px`.
- **`padding="lg"` (24px):** Restricted to large detail panels and single-column full pages. **Avoid using in lists.**

### 2. Spacing Accumulation Hazards
- **Accumulated Gutters:** Margins between stacked cards (e.g. `space-y-4` or `gap-4`) can push action buttons below the fold on mobile viewports.
- **Rule:** When cards are stacked in a list, limit vertical margins to `12px` (`gap-3` or `space-y-3`).

---

## 📱 Mobile Wrapping and Data Overflow Safeguards

To prevent layout breakages on narrow mobile screens (down to `320px`), cards must utilize the following safeguards:

1. **Text Clamping Rules:**
   - Long descriptions and notes must use line-clamping (`line-clamp-2` or `line-clamp-3`) to limit maximum container height.
   - Long fields (e.g. email addresses or technician names) must use `break-words` or `break-all` to prevent horizontal card stretching.

2. **Responsive Column Wrap Guardrails:**
   - Multi-column layouts must wrap to a single column on mobile.
   - Ensure card widths do not shrink below `280px` on small devices.

3. **Avoid Hardcoded Heights:**
   - **Never** set fixed height parameters (e.g. `h-[200px]`) on containers wrapping dynamic database text. Cards must adapt their heights fluidly to prevent content clipping.
