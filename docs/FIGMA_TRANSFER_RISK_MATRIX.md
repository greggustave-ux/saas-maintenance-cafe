# Figma Transfer Risk Matrix - Welo Platform SaaS

This document establishes the Figma Transfer Risk Matrix for Welo Platform. It classifies potential UI alignment targets into safety tiers, defines approved initial targets, and details runtime protection rules.

---

## 🚦 Alignment Safety Classifications

To protect Welo Platform's functional stability, all UI elements are classified into safety tiers:

| Safety Tier | Definition | Allowed Modifications | Exclusions / Blocked Elements |
| :--- | :--- | :--- | :--- |
| **`SAFE`** | Static token systems and passive visual primitives. Zero dependency on state logic. | Spacing tokens, border radii, typography variables, HSL color channels. | Local hardcoded text strings, layout shifts. |
| **`CONTROLLED`** | Shared design system components displaying passive database values. | Stateless primitives: `DSBadge`, `DSButton`, `DSCard`, key-value preview panels. | State variables, interactive logic modifications, click handlers. |
| **`HIGH_RISK`** | Mobile screens and detail pages containing active form inputs and device triggers. | Margins on technicians directory cards, read-only headings on detail panels. | Media capture hooks, camera sensors, location APIs, active inputs. |
| **`BLOCKED`** | Core transactional modules, auth security controllers, and print rendering sheets. | None. Visual alignment is entirely blocked. | Dispatcher Kanban cells, `#pdf-print-template`, canvas signatures, auth pages. |

---

## 🎯 Recommended UI Transfer Sequence

Alignment must progress from low-risk global tokens to isolated component primitives:

1. **Design Tokens (Phase 1 - `SAFE`):**
   - *Target:* Consolidate missing spacing (`--space-xs`, `--space-sm`), radius (`--radius-sm`), and status HSL configurations inside [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
2. **`DSBadge` Continuation (Phase 2 - `CONTROLLED`):**
   - *Target:* Replace legacy badges inside other list views (like Service Call Archives or Technicians Index).
3. **`DSCard` (Phase 3 - `CONTROLLED`):**
   - *Target:* Create a reusable stateless wrapper for consistent layout panel shadows and borders.
4. **`DSButton` (Phase 4 - `CONTROLLED`):**
   - *Target:* Implement standard buttons that consume centralized primary/secondary HSL tokens.
5. **Mobile Technician Card Visual Refinement (Phase 5 - `HIGH_RISK`):**
   - *Target:* Standardize paddings on mobile list previews to match the target Figma card layouts.
6. **Service Call Card Visual Refinement (Phase 6 - `HIGH_RISK`):**
   - *Target:* Standardize column spacing on the main index dashboard cards.
7. **Machine History Visual Refinement (Phase 7 - `HIGH_RISK`):**
   - *Target:* Refine timeline borders on the service call detail page.

---

## 🚫 Strictly Excluded & Blocked Target Registry

The following areas must remain unmodified to prevent operational failures:
- **Dispatcher Kanban Board:** Sizing adjustments inside `/dashboard/dispatch` columns could cause card wrapping, breaking drag targets.
- **PDF Export Templates:** Layout reflows inside `#pdf-print-template` can cause page clipping or margin errors on exported A4 documents.
- **Auth and Authorization Pages:** Security logic and page layout must remain locked to prevent access middleware bypasses.
- **Signature Validation Flow:** Signature pads and client approval canvas views are blocked.
- **File Upload Widgets:** Layout grids containing active upload listeners are blocked.
- **Supabase / Database RLS Schemas:** All database mutation scripts, SSR fetching functions, and Row-Level Security parameters are blocked.

---

## 📱 Runtime Reality Protection Rules

To prevent regressions in production, all visual transfers must adhere to the following protection rules:

### 1. Dynamic Data Density Safeguard
- **Rule:** Assume database values (e.g. technician names or machine descriptions) will exceed the lengths shown in Figma mockups.
- **Mitigation:** Use `truncate` or `break-words` text constraints to ensure layouts do not break when data overflows.

### 2. Mobile Viewport Variability Safeguard
- **Rule:** Layout sizes must adapt to all device formats.
- **Mitigation:** Rely on percentage-based widths and flex containers. Do not translate static Figma height/width values directly to fixed pixel sizes.

### 3. Safe-Area Protection
- **Rule:** Mobile overlays and lists must not block device system interfaces.
- **Mitigation:** Ensure bottom bars and modals use relative viewport margins to account for physical device notches.

### 4. Network Status Awareness
- **Rule:** Visual updates must not obscure connection status bars.
- **Mitigation:** Standardize loading states (skeletons) and offline indicators in the global layout.
