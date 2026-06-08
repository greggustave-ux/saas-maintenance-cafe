# Protected Workflow Boundaries - Welo Platform SaaS

This document establishes the Protected Workflow Boundaries for Welo Platform. It defines the codebase areas, components, and workflows that must remain completely locked during Figma-to-code alignment sessions to prevent regressions and operational failures.

---

## 🚫 Strictly Blocked Subsystems & Code Patterns

The following codebase modules and directories are protected. Production-safe operational behavior always has priority over visual alignment.

### 1. Dispatcher Kanban Board & Column Widgets
- **Target Paths:** `src/modules/service_calls/components/dispatch/` and `/dashboard/dispatch`.
- **Blocked Patterns:** 
  - Do not modify card container padding, flex sizes, or margins inside drag-and-drop slots. Sizing modifications could cause card wrapping, layout shifting, or drag bubble failures.
  - Do not rename or remove CSS classes consumed by drag-and-drop library listeners (e.g. `react-beautiful-dnd` hooks).
  - Do not refactor columns or list card grid logic.

### 2. PDF Download & Export Templates
- **Target Paths:** `#pdf-print-template` element and associated print styling sheets in `/dashboard/service-calls/[id]`.
- **Blocked Patterns:** 
  - Do not swap legacy HTML inline styles or replace simple text elements with custom design-system primitives (like `DSBadge` or custom lists) in the print-only view.
  - Do not modify inline table margins, border colors, or typography dimensions under print media queries (`@media print`). Margin offsets can cause data truncations on PDF sheets.

### 3. Signature Validation Canvas
- **Target Paths:** `src/modules/service_calls/components/SignatureSection.tsx`.
- **Blocked Patterns:** 
  - Do not refactor signature drawing canvases, height/width attributes, or save trigger buttons.
  - Do not alter the error message styling or warning display containers related to signature validations.

### 4. Mobile Technician Operational Flows
- **Target Paths:** All screens rendered for mobile technician usage (e.g. status dispatch triggers, camera image capture interfaces, and sync triggers).
- **Blocked Patterns:**
  - Do not wrap operational buttons or status selectors in custom layout flex containers that could push elements below the viewport fold.
  - Keep touch target heights strictly at `44px` or above. Do not reduce component paddings to match desktop-first Figma prototypes.

### 5. Authentication, Access Control & Admin Modules
- **Target Paths:** `/login`, `/register`, `/blocked`, and `/admin/*`.
- **Blocked Patterns:**
  - Do not modify form structures, input event listeners, or authorization check hooks.
  - Layout structures and page margins must remain unchanged to avoid breaking access verification checks.

### 6. Service Call Database Mutations
- **Blocked Patterns:**
  - Alignment activities are strictly visual. Under no circumstances should database query hooks (e.g., Supabase SSR calls, RPC methods, SQL schemas, or direct fetch actions) be added, updated, or removed from components.
