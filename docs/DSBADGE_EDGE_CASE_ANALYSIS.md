# DSBadge Edge Case Analysis - Welo Platform SaaS

This document establishes the DSBadge Edge Case Analysis for Welo Platform. It analyzes potential layout glitches, overflow issues, rendering densities, and theme conflicts when integrating `DSBadge` into standard UI patterns.

---

## 🔍 Hidden Layout & Density Edge Cases

### 1. Long-Label Overflow Risks
- **Issue:** If custom `label` overrides are passed to the component (e.g., `<DSBadge category="status" variant="waiting_parts" label="En attente de validation du superviseur" />`), the text span will stretch horizontally.
- **Risk:** In compact grid sections or card headers, this will push adjacent elements off-screen or wrap inside small flex items, causing severe height expansion.
- **Mitigation:** Custom labels should be restricted to short fragments, or parent containers must enforce horizontal constraints using CSS styling.

### 2. High-Density Renderings (Lists and Tables)
- **Issue:** When rendering 50+ lines in tables or vertical timelines, badges with thick borders or excessive paddings can increase row heights, leading to layout shift.
- **Risk:** Spacing changes degrade table legibility on dense dashboards (such as service call indexes).
- **Mitigation:** The paddings `px-2 py-0.5` on `DSBadge` are small enough to match default text bounds. We must block adding vertical margins (`my-*`) directly to the badge root.

---

## 🎨 Theme & Rendering Risks

### 1. Dark/Light Mode Color Drift
- **Issue:** The component relies on hardcoded tailwind alpha variables (e.g., `bg-sky-50/70` in light mode, `dark:bg-sky-950/20` in dark mode).
- **Risk:** If dark backgrounds vary between `#090d16` and `#1f2937` (slate-900), the low-opacity color backgrounds can bleed, reducing contrast below 4.5:1.
- **Mitigation:** We must ensure dark containers maintain standard dark tones (`bg-slate-950` or `bg-slate-900`) behind status badges to preserve contrast.

### 2. PDF Rendering Layout Shifts
- **Issue:** PDF templates built with html2canvas/jspdf (e.g., client reports) struggle to calculate complex CSS variables or opacity borders.
- **Risk:** Transparent backgrounds (e.g., `bg-sky-50/70`) may render as completely black boxes or vanish entirely on printed templates.
- **Mitigation:** PDF template routes must use plain inline solid background colors. We must **explicitly block** replacing print-template text badges with `DSBadge` primitives until solid-color print classes are defined.

---

## 🚦 Future Rollout Risks & Migration Blockers

### 1. Future Dispatcher-Board (Kanban) Risks
- **Issue:** The dispatcher board relies on drag-and-drop actions. If badges are wrapped in click targets or dropdown menus, event propagation can bubble.
- **Risk:** Clicking a status menu could trigger a card drag action simultaneously, leading to UI jitter.
- **Mitigation:** The badge must remain a stateless, pure visual element. Interactive status selectors should wrap the badge in a standard `<button>` container rather than putting click handlers on the badge itself.

### 2. Inconsistent Translation Maps
- **Issue:** If additional status variants are added to the database schema but left unmapped in the component translation dictionary, the badge will render the raw database string.
- **Risk:** Capitalization issues or snake_case texts (e.g. `on_the_way`) will show up directly in the UI.
- **Mitigation:** Maintain strict typescript variant typing, and write tests to ensure every database enum matches a French translation label.
