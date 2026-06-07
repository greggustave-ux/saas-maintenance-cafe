# Design Token Correlation Audit - Welo Platform SaaS

This document establishes the Design Token Correlation Audit for Welo Platform. It maps Figma design variables to React/CSS properties, identifying gaps and styling drifts.

---

## 📊 Design Token Correlation Table

The table below correlates the design variables defined in Figma collections with the stylesheet rules in the codebase:

| Token Category | Figma Token Name | TypeScript Code Token | CSS variable (`globals.css`) | Status / Gaps |
| :--- | :--- | :--- | :--- | :--- |
| **Color** | `colors/bg` | `colors.background` | `var(--background)` | **CORRELATED** (Set in CSS) |
| **Color** | `colors/text` | `colors.foreground` | `var(--foreground)` | **CORRELATED** (Set in CSS) |
| **Color** | `colors/primary` | `colors.primary` | `var(--primary)` | **CORRELATED** (Set in CSS) |
| **Color** | `colors/accent` | `colors.accent` | `var(--accent)` | **CORRELATED** (Set in CSS) |
| **Color (Status)** | `status/pending` | `colors.status.pending` | `var(--status-pending)` | **GAP:** Missing from CSS |
| **Color (Status)** | `status/active` | `colors.status.active` | `var(--status-active)` | **GAP:** Missing from CSS |
| **Spacing** | `spacing/xs` (4px) | `spacing.xs` | `var(--space-xs)` | **GAP:** Missing from CSS |
| **Spacing** | `spacing/sm` (8px) | `spacing.sm` | `var(--space-sm)` | **GAP:** Missing from CSS |
| **Spacing** | `spacing/md` (16px) | `spacing.md` | `var(--space-md)` | **GAP:** Missing from CSS |
| **Spacing** | `spacing/lg` (24px) | `spacing.lg` | `var(--space-lg)` | **GAP:** Missing from CSS |
| **Spacing** | `spacing/xl` (32px) | `spacing.xl` | `var(--space-xl)` | **GAP:** Missing from CSS |
| **Radius** | `radius/sm` (4px) | `radius.sm` | `var(--radius-sm)` | **GAP:** Missing from CSS |
| **Radius** | `radius/md` (8px) | `radius.md` | `var(--radius-md)` | **GAP:** Missing from CSS |
| **Radius** | `radius/lg` (16px) | `radius.lg` | `var(--radius-lg)` | **GAP:** Missing from CSS |
| **Radius** | `radius/xl` (24px) | `radius.xl` | `var(--radius-xl)` | **CORRELATED** (Set in CSS) |
| **Typography** | `font/sans` | `typography.fontFamily`| `var(--font-sans)` | **CORRELATED** (Set in CSS) |
| **Typography** | `font-size/sm` (12px) | `typography.fontSize.sm`| `var(--font-size-sm)` | **GAP:** Missing from CSS |
| **Typography** | `font-size/base`(14px)| `typography.fontSize.base`|`var(--font-size-base)`| **GAP:** Missing from CSS |
| **Typography** | `font-size/md` (18px) | `typography.fontSize.md`| `var(--font-size-md)` | **GAP:** Missing from CSS |
| **Typography** | `font-size/lg` (24px) | `typography.fontSize.lg`| `var(--font-size-lg)` | **GAP:** Missing from CSS |
| **Touch Sizing** | `touch/min-size` | `touchTargets.minWidthHeight`| `var(--touch-target-min)`| **GAP:** Missing from CSS |

---

## 🔍 Token Gaps & Naming Inconsistencies

1. **Missing CSS Properties:** The custom variable declarations for spacings (`--space-*`), typography sizes (`--font-size-*`), smaller radii (`--radius-sm`, `--radius-md`, `--radius-lg`), status colors (`--status-*`), and touch bounds (`--touch-*`) are absent from the `:root` styling block in [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
2. **Naming Drifts:** Figma collections use folder hierarchies (`spacing/md` or `colors/status/pending`). The TypeScript helpers map these using object dot notations (`spacing.md` or `colors.status.pending`), while the CSS variables use dashes (`--space-md` or `--status-pending`). A formal naming collection mapper is required to coordinate naming conversions.

---

## 📂 Reference Guidelines
- **Figma to Component Correlation:** [docs/FIGMA_TO_COMPONENT_CORRELATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_TO_COMPONENT_CORRELATION.md)
- **Component Mapping Registry:** [docs/COMPONENT_MAPPING_REGISTRY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_MAPPING_REGISTRY.md)
- **UI Inconsistency Tracker:** [docs/UI_INCONSISTENCY_TRACKER.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_INCONSISTENCY_TRACKER.md)
- **Future Alignment Plan:** [docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **UI Component Gap Analysis:** [docs/UI_COMPONENT_GAP_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_COMPONENT_GAP_ANALYSIS.md)
