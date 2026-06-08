# DSBadge Extraction Plan - Welo Platform SaaS

This document establishes the DSBadge Extraction Plan for Welo Platform. It defines the proposed React component API, token dependencies, styling strategies, testing parameters, and rollout phases for standardizing the badge primitives.

---

## 📦 Future Reusable Prop Structure

To unify `StatusBadge` and `PriorityBadge` under a single primitive, the proposed `DSBadge.tsx` API is structured as follows:

```typescript
export type DSBadgeCategory = 'status' | 'priority';

export type DSBadgeVariant =
  | 'new' | 'assigned' | 'on_the_way' | 'on_site' | 'waiting_parts' | 'completed' | 'closed' | 'cancelled'
  | 'low' | 'medium' | 'high' | 'urgent';

export interface DSBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: DSBadgeCategory;
  variant: DSBadgeVariant;
  label?: string; // Optional custom text override (falls back to translated string)
  showDot?: boolean; // Optional status pulse indicator dot
}
```

---

## 🎨 Color & Token Strategies

- **Color variables Mapping:** Variant class styles will map directly to HSL variables declared in [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
  - Status completed: `border-[var(--status-completed)] bg-[var(--status-completed)]/10 text-[var(--status-completed)]`.
- **Corner Radius:** Unify badge rounded corners to `--radius-sm` (`4px`).
- **Tailwind Integration:** Custom variables will be exposed to Tailwind's `@theme` config layer to support helper classes (e.g. `bg-status-completed`).

---

## ♿ Accessibility & Mobile Readability Rules

- **WCAG AA Compliance:** Text and background color contrast ratios must exceed **`4.5:1`**. For light-theme elements, background opacities must equal `10%` to keep the text legible.
- **Font Constraints:** Font sizes must equal `10px` or `12px` (`var(--font-size-sm)`). Text must use semibold weight (`600`) to remain readable on low-resolution screen sizes.
- **Tap Safety:** If a badge is clickable (e.g. status dropdown trigger), the container size must scale or wrap in a touch-target container measuring at least **`44px x 44px`**.

---

## 🧪 Future Testing Strategy

Before shipping the component, write these automated tests:
1. **Contrast Ratio Audits:** Run automated color contrast validation checks using testing-library.
2. **Prop Validation Checks:** Verify the badge renders correct fallbacks when passed invalid variant strings.
3. **Viewport Render Audits:** Verify that text labels wrap cleanly inside grid columns without overflowing parent cards.

---

## 📅 Phased Rollout Sequence

The transition from inline spans to `DSBadge` must follow a three-stage rollout plan:

```
[1. CSS Token Prep] ➔ [2. Component Registry Addition] ➔ [3. Staged Refactoring]
```

- **Phase 1: Token Prep:** Declare the missing `--status-*` and `--radius-sm` variables inside `globals.css`.
- **Phase 2: Registry Addition:** Add `DSBadge` metadata block to `component-registry.ts` mapping it to Figma `node-id=101:4`.
- **Phase 3: Refactoring:** Replace inline badge spans in `/app/dashboard/service-calls/page.tsx` first (non-critical list page), followed by the detail page card widgets.

---

## 📂 Reference Guidelines
- **Risk Analysis:** [docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md)
- **Usage Inventory:** [docs/DSBADGE_USAGE_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_USAGE_INVENTORY.md)
- **Rollback Strategy:** [docs/DSBADGE_ROLLBACK_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_ROLLBACK_STRATEGY.md)
- **Implementation Rules:** [docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md)
- **Figma to Component Correlation:** [docs/FIGMA_TO_COMPONENT_CORRELATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_TO_COMPONENT_CORRELATION.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
