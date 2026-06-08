# DSCard Scalability Assessment - Welo Platform SaaS

This document establishes the Scalability Assessment for the `DSCard` component. It evaluates visual readiness, maps future integration plans, and enforces strict boundary rules.

---

## 📈 Scalability Readiness Evaluation

Based on the audit of the stateless `DSCard` component's initial rollout, we evaluated its scalability for future integrations:

### 1. Readiness for `ServiceCallCard.tsx`
- **Assessment:** **READY WITH CONDITIONS.**
- **Details:** The primitive supports `hoverable` animations and custom classes.
- **Safety Conditions:**
  - When migrating the `ServiceCallCard` container, we must use `padding="md"` (16px) to match the current density.
  - The status selection dropdown and bottom action buttons must preserve their current heights (`min-h-11`) to prevent touch-target failures.

### 2. Readiness for AI Insight Cards
- **Assessment:** **READY.**
- **Details:** The `flat` variant of `DSCard` is suitable for the AI suggestions panel.
- **Safety Conditions:** Use the HSL alert backgrounds to highlight suggestions without adding redundant shadows.

### 3. Readiness for Mobile-Heavy Technician Screens
- **Assessment:** **READY WITH CONDITIONS.**
- **Details:** Mobile cards require minimal vertical heights.
- **Safety Conditions:** Cards rendered on mobile viewports must enforce wrapping on all status indicators and buttons to prevent horizontal overflow.

---

## 🚫 Blocked Layout Scopes & Visual Patterns

The following areas must remain excluded from any future card migration:

- **Dispatcher Drag-and-Drop Slots:** Custom Kanban columns inside `/dashboard/dispatch` rely on precise inline heights for list height math. Replacing these elements with `DSCard` is blocked.
- **PDF Export Templates:** The print template `#pdf-print-template` must remain simple, plain-text HTML tables. Using card components is blocked to avoid page breaks and truncations during exports.
- **Access Control Screens:** The `/login` and `/blocked` screens are blocked to prevent visual styling dependencies in role middleware.
