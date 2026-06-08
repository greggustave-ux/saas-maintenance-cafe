# Figma-to-Code Alignment Strategy - Welo Platform SaaS

This document establishes the Figma-to-Code Alignment Strategy for Welo Platform. It outlines the progressive convergence strategy to align existing Figma layout mockups with production-safe code implementations without introducing regressions or breaking critical workflows.

---

## 🔍 Context Comparison Analysis

Our audit compared the structural and visual features in the Figma mockup against the current codebase components and page structures:

### 1. Visual-Only Differences (Low Risk)
- **Observations:** Minor discrepancies in typography weight/tracking, container border highlights, button hover transparency ratios, and card shadow elevation values.
- **Alignment Method:** Safe HSL token synchronization. Direct updates to CSS custom properties in [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css) will automatically cascade visual shifts without editing JSX structures or layout logic.

### 2. Structural & Layout Differences (Medium-to-High Risk)
- **Observations:** Differences in page margin gutters, sidebar panel structures on details views, header wrapping on narrow viewports, and column widths within search indexes.
- **Alignment Method:** Component-by-component layout matching. We isolate layouts from interactive page hooks, adjusting padding grids step-by-step with responsive layout checks.

### 3. Component Mismatches (High Risk)
- **Observations:** Inconsistent form elements (raw HTML input fields vs design-system tokenized `DSInput`/`DSSelect` elements) and status indicator wrappers.
- **Alignment Method:** Safe phased replacement. Component updates are rolled out in static/secondary views first before migrating critical transactional views.

---

## 🛠️ Missing Production-State Components & Gap Analysis

Figma designs represent a "happy path" static mock. The production application must support robust real-time synchronization, offline capabilities, and permission systems. The following production-state components are missing in the Figma design and must be accounted for:

1. **Offline & Connectivity Indicators (`OfflineSyncIndicator`):**
   - *Status:* Implemented in production, missing in Figma.
   - *Strategy:* Protect this banner in the layout header. It must remain visually high-contrast and unaffected by alignment spacing adjustments.

2. **Loading States (Skeletons & Spinners):**
   - *Status:* Implemented in list and detail page loads, missing in Figma.
   - *Strategy:* Use standardized `DSSkeleton` layouts matching the structural dimensions of the target cards.

3. **Error States (Form Validation & Mutation Errors):**
   - *Status:* Raw UI alerts in code, missing in Figma.
   - *Strategy:* Style errors using the stabilized HSL error tokens (`--status-blocked-text`, `--status-blocked-bg`) to maintain design system conformity.

4. **Sync States (Real-time DB Connection / Sync Queue):**
   - *Status:* Background Sync Queue component in code, missing in Figma.
   - *Strategy:* Render passive circular spinner icons inside secondary header rows to display sync activity without shifting neighboring layout elements.

5. **Degraded Network States (Slow Bandwidth & Timeout Warnings):**
   - *Status:* Toast overlays in code, missing in Figma.
   - *Strategy:* Keep toast notifications styled with neutral visual overlays (`--neutral-700` colors) so they do not overlap active forms.

6. **Empty States (Empty Search Lists & Filter Results):**
   - *Status:* Inline plain text warnings in code, missing in Figma.
   - *Strategy:* Define a standard empty-state template containing a passive SVG graphic, styled label, and helper instruction.

7. **Permission & Access Denied States (Role Enforcement Page overlays):**
   - *Status:* `/dashboard/blocked` route in code, missing in Figma.
   - *Strategy:* Keep permission locks as plain screen overlays. Do not inject theme styling that could bypass structural access middleware.

8. **Mobile Failure States (Camera, GPS, or Signature Canvas issues):**
   - *Status:* Alert blocks in code, missing in Figma.
   - *Strategy:* Keep operational technician warning banners at the top of detail headers to ensure high legibility.

---

## ⚡ Operational Edge-Case UI (Not in Figma)

Figma prototypes focus on static, successful user actions. The production application handles complex edge cases that must be protected:

- **Signature Validation Failure:** When the user attempts to sign but the signature is blank or has too few touch coordinates. The system must display a helper alert without breaking the vertical height of page sections.
- **Background Sync Conflicts:** When local storage changes conflict with new Postgres records. The resolution interface must render in an isolated modal overlay rather than reflowing the page list.
- **Database Connection Dropout:** A banner warning the technician that mutations will be queued locally. The banner must use simple inline styles that cannot be broken by theme shifts.

---

## 🌐 Future Client-Portal Design Isolation Boundaries

Welo Platform plans to support customer-facing portals in the future. To prevent design systems from conflicting, we establish the following boundaries:

- **Namespace Isolation:** All future client portal styling must be scoped under a dedicated `.welo-client-portal` root CSS selector.
- **Token Sandboxing:** Client custom themes (e.g. tenant branding, logo colors) must override client-scoped CSS variables (e.g. `--client-primary`, `--client-radius`) rather than editing global SaaS token sets.
- **Layout Separation:** Portal pages must reside under separate routing files (e.g. `/app/portal/`) and consume independent layout sheets to prevent admin dashboard code regressions.

---

## 📈 Progressive Convergence Strategy

Rather than executing a wholesale layout rewrite, convergence follows a strict three-layered approach:

```
[1. CSS Token Cascade] ➔ [2. Pure Visual Primitives] ➔ [3. Layout Alignment Patching]
```

1. **Token Synchronization (Layer 1):** Declare all required HSL values (for backgrounds, grids, typography, and borders) globally.
2. **Primitive Replacement (Layer 2):** Swap static labels (e.g. badges, display indicators) for unified primitives.
3. **Structured Refactoring (Layer 3):** Refactor grid layouts and column widths on non-protected lists, using mobile-first view testing to ensure no overlaps.

---

## 🚦 Rollback & Regression Protection

1. **File Checkout Rollbacks:**
   - Any layout shift or visual drift must trigger a local file rollback:
     ```bash
     git checkout HEAD -- app/
     ```
2. **Regression Testing Scope:**
   - Compile validation: `npx tsc --noEmit`.
   - Linter checks: `npm run lint`.
   - Next.js production builds: `npm run build`.
3. **Mobile-First Audits:**
   - Verify viewports down to `320px` to check that flex rows wrap correctly and touch targets maintain `min-h-44` dimensions.
