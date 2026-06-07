# DSBadge Migration Risk Analysis - Welo Platform SaaS

This document establishes the DSBadge Migration Risk Analysis for Welo Platform. It classifies badge standardization tasks into safety tiers and evaluates regression risks for critical workflows.

---

## 🚦 Safety Classification of Refactoring Tasks

Refactoring the badge elements is structured into the following safety tiers:

- **SAFE:** Writing documentation, mapping Figma Node IDs, and adding CSS variables inside `globals.css`.
- **CONTROLLED:** Replacing inline spans inside static sidebar menus or read-only histories (like `MachineHistorySection`).
- **HIGH-RISK:** Modifying status dropdown selectors inside cards or forms where styling changes overlap with state handlers.
- **BLOCKED:** Overwriting or modifying badge markup inside `#pdf-print-template` or auth redirect views without coordinating manual print tests.

---

## 📊 Regression Risks & Mitigations

### 1. Service Call Status Flows (HIGH-RISK)
- **Risk:** Status selectors inside list cards currently pass inline Tailwind classes (`getStatusColor`). Replacing these elements might break state variables or trigger accidental status change database updates.
- **Mitigation:** Retain the raw HTML `<select>` tag value triggers and only replace the style class strings with the standardized CSS custom variables.

### 2. PDF Report Rendering Layout (BLOCKED)
- **Risk:** The `#pdf-print-template` element uses fixed dimensions to compile clean A4 prints. Resizing badges inside the report container can shift margins or clip text boundaries on page cuts.
- **Mitigation:** The PDF template remains locked. Any badge visual alignment must be validated via PDF export tests before staging commits.

### 3. Technician Mobile Screens (HIGH-RISK)
- **Risk:** Status badges on mobile lists (`ServiceCallCard`) need distinct color contrasts. Inadequate background-to-text contrasts can prevent technicians from distinguishing between active or completed states on outdoor devices.
- **Mitigation:** Follow WCAG 2.1 AA parameters. Use HSL values with minimum text sizes of `10px` and font weight `600`.

### 4. Dispatcher Board Kanban cards (HIGH-RISK)
- **Risk:** Priority indicators on Kanban columns determine card sorting orders.
- **Mitigation:** Ensure PriorityBadge styling changes do not modify priority properties (`urgent`, `high`, `medium`, `low`) that feed the dispatch sorting algorithm.

---

## 📂 Reference Guidelines
- **Extraction Plan:** [docs/DSBADGE_EXTRACTION_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_EXTRACTION_PLAN.md)
- **Usage Inventory:** [docs/DSBADGE_USAGE_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_USAGE_INVENTORY.md)
- **Rollback Strategy:** [docs/DSBADGE_ROLLBACK_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_ROLLBACK_STRATEGY.md)
- **Implementation Rules:** [docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
