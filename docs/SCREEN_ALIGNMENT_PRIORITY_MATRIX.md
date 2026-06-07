# Screen Alignment Priority Matrix - Welo Platform SaaS

This document establishes the Screen Alignment Priority Matrix for Welo Platform. It classifies the visual pages and components into alignment safety tiers to determine rollout priorities.

---

## 🚦 Alignment Safety Tier Definitions

To protect the operational stability of the application, all screens are categorized into one of four safety tiers:

1. **`SAFE_ALIGNMENT` (Low Risk):**
   - *Definition:* Passive, read-only data presentation layers without complex interactive state hooks or database mutation handlers. Spacing shifts will not affect user workflows.
   - *Example:* Historical lists, directories, archives.
2. **`CONTROLLED_ALIGNMENT` (Medium Risk):**
   - *Definition:* Read-only views containing list sorting, client filtering, or simple layout wrappers. Changes are allowed only under strict responsive view testing.
   - *Example:* Filterable indexes, card lists.
3. **`HIGH_RISK_ALIGNMENT` (High Risk):**
   - *Definition:* Transactional user input zones containing signature canvas blocks, photo uploads, or active state mutations. Visual changes could disrupt event handlers.
   - *Example:* Detail page headers, input fields, forms.
4. **`BLOCKED_ALIGNMENT` (Critical Risk):**
   - *Definition:* System-critical areas, including authentication layers, custom drawing elements, third-party libraries, drag-and-drop engines, or page-rendered PDF templates. Spacing or layout changes are strictly forbidden.
   - *Example:* Dispatch board Kanban cells, print templates, login flows.

---

## 📊 Screen Alignment Matrix & Risk Metrics

Operational functionality always takes precedence over visual alignment.

| Screen Name / Component | Route / Path | Safety Tier | Priority | Layout Density Risk | Mobile Wrapping Risk | Safety Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Archives List** | `/dashboard/service-calls/archives` | `SAFE_ALIGNMENT` | **High (P1)** | **Low** | **Low** | Cleared for token alignment |
| **Clients Directory** | `/dashboard/clients` | `SAFE_ALIGNMENT` | **High (P1)** | **Low** | **Low** | Cleared for token alignment |
| **Technicians Directory** | `/dashboard/technicians` | `CONTROLLED_ALIGNMENT` | **Med (P2)** | **Medium** | **Medium** | Under active viewport testing |
| **Service Calls Index** | `/dashboard/service-calls` | `CONTROLLED_ALIGNMENT` | **Med (P2)** | **High** | **High** | Under active viewport testing |
| **Detail Page Sidebar** | `/dashboard/service-calls/[id]` | `HIGH_RISK_ALIGNMENT` | **Low (P3)** | **High** | **High** | Alignment restricted to text sizes |
| **Dispatcher Kanban** | `/dashboard/dispatch` | `BLOCKED_ALIGNMENT` | **Blocked** | **Critical** | **Critical** | **LOCKED (Blocked)** |
| **Print Template** | Inside Details Page | `BLOCKED_ALIGNMENT` | **Blocked** | **Critical** | **N/A** | **LOCKED (Blocked)** |
| **Auth Pages** | `/login`, `/register`, `/blocked` | `BLOCKED_ALIGNMENT` | **Blocked** | **Medium** | **Low** | **LOCKED (Blocked)** |

---

## 🛠️ Density & Wrapping Risk Mitigation Guidelines

To prevent UI breakage on diverse device profiles, follow these strict parameters:

- **Grid Sizing Guardrails:** When modifying column grids on list views (such as the Service Calls Index), use responsive Tailwind wrappers (e.g. `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to prevent cards from becoming narrower than `280px` on small screens.
- **Flex-Wrap Enforcement:** Avoid setting hard layouts via `flex-nowrap` on headers or info badges. Use `flex-wrap` and specify margins via `gap-*` classes to ensure badges reflow cleanly instead of overflowing their parent containers.
- **Tappable Minimum Boundaries:** Ensure any interactive elements adjusted for visual padding maintain a touch-target size of at least `44px` on mobile layouts.
