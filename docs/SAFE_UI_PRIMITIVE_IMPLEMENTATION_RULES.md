# Safe UI Primitive Implementation Rules - Welo Platform SaaS

This document establishes the Safe UI Primitive Implementation Rules for the Welo Platform. It defines the coding standards, decoupling requirements, and developer approval gates to ensure safe, visual-only component standardizations.

---

## 🛠️ Primitive Coding Standards

All new design-system primitives (such as `DSBadge`, `DSButton`, `DSCard`) must be built under strict isolation guidelines:

### 1. Stateless Design & Pure Properties
- **Rule:** Component files must remain **completely stateless** (unless managing purely internal UI states like toggles).
- **Decoupling:** Do not import Supabase clients, hooks, database utilities, or environment configurations.
- **Data Flow:** All information must flow into components via TypeScript properties (`props`), and all mutations must exit via callback parameters (`onEvent`).

### 2. Pure CSS Custom Variables
- **Rule:** Component styles must map directly to CSS Custom Properties (`var(--primary)`) declared in [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
- **Decoupling:** Do not write hardcoded hex color values or absolute pixel spacings inside styled classes.

### 3. Accessible Dimensions & Contrast
- **Rule:** Every element must comply with WCAG 2.1 AA parameters. Contrast ratios must exceed `4.5:1`. Click targets must exceed `44px x 44px`.

### 4. Component Metadata
- **Rule:** Components must expose a static `metadata` property containing their registry data:
  ```typescript
  DSBadge.metadata = COMPONENT_REGISTRY.DSBadge;
  ```
- **Decoupling:** Include the data attribute `data-welo-component` on the root node for passive audit mapping.

---

## 🚧 Developer Approval Gates

Before a primitive is implemented or integrated into codebase pages, it must clear three human checkpoints:

### 1. Checkpoint 1: Code Review Gate
- **Requirement:** A developer must inspect the props type definitions and verify zero Supabase/external database imports are present.

### 2. Checkpoint 2: Layout Regression Gate
- **Requirement:** Confirm that swapping existing badge spans does not modify the underlying state action listeners (e.g. `onChange` triggers).

### 3. Checkpoint 3: PDF Print Checkpoint
- **Requirement:** If a primitive modifies elements inside PDF templates, a developer must run a manual PDF export check to verify layout continuity.

---

## 📂 Reference Guidelines
- **Extraction Plan:** [docs/DSBADGE_EXTRACTION_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_EXTRACTION_PLAN.md)
- **Risk Analysis:** [docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md)
- **Usage Inventory:** [docs/DSBADGE_USAGE_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_USAGE_INVENTORY.md)
- **Rollback Strategy:** [docs/DSBADGE_ROLLBACK_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_ROLLBACK_STRATEGY.md)
- **Figma to Component Correlation:** [docs/FIGMA_TO_COMPONENT_CORRELATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_TO_COMPONENT_CORRELATION.md)
