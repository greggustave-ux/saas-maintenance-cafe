# Progressive UI Alignment Roadmap - Welo Platform SaaS

This document establishes the Progressive UI Alignment Roadmap for Welo Platform. It defines the phased sequence, verification gates, and rollout strategy to align codebase styling with Figma prototypes safely.

---

## 📅 Phased Alignment Roadmap

Visual convergence must proceed in four distinct, validation-gated phases:

```
[Phase 1: Token Audit] ➔ [Phase 2: Secondary Lists] ➔ [Phase 3: Detail Panels] ➔ [Phase 4: Kanban Validation]
```

### Phase 1: CSS Token Convergence (Light/Dark Mode)
- **Objective:** Synchronize basic spacing, border, and color values inside [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
- **Execution:** Expose missing radius and color tokens inside the Tailwind theme configuration layer.
- **Verification Gate:** Run Next.js production build (`npm run build`) and verify visual continuity.

### Phase 2: Secondary Index Lists Refactoring
- **Objective:** Refactor row layouts, margins, and card headers on non-critical pages.
- **Execution:** Align Clients page (`/dashboard/clients`) and Archives page (`/dashboard/service-calls/archives`) first. Apply standard layout styles component-by-component.
- **Verification Gate:** Perform mobile-first viewport checks down to `320px` to check for column clipping.

### Phase 3: Detail Panel Structural Alignment
- **Objective:** Refactor secondary cards inside detail pages.
- **Execution:** Align machines list cards and notes textareas.
- **Verification Gate:** **Strictly bypass** `#pdf-print-template` and signature sections. Run PDF export validation to confirm zero margin displacement.

### Phase 4: Kanban Dispatcher Review
- **Objective:** Assess alignment readiness for dispatcher Kanban cards.
- **Execution:** Block active Kanban code modifications. Perform dry-run drag-and-drop bubble audits inside local sandboxes.
- **Verification Gate:** Requires separate technical sign-off.

---

## 🚦 Rollback & Regression Gate Controls

In case of layout shifts, visual regressions, or functional errors during any phase, execution of the rollback and verification strategy is required.

### 1. Rollback Strategy
- **Immediate Local Rollback:** If layout drift or visual defects are detected on screen, revert the files immediately using git:
  ```bash
  git checkout HEAD -- <modified_file_path>
  ```
- **Staged Reversion:** To discard all uncommitted layout changes in the working tree:
  ```bash
  git reset --hard HEAD
  ```

### 2. Regression Verification Strategy
Before marking any alignment step as complete, run the following verification steps:
- **TypeScript Compilation:** Check for any type mismatch or imports breakage:
  ```powershell
  npx tsc --noEmit
  ```
- **Linter Audit:** Confirm compliance with project styling rules:
  ```powershell
  npm run lint
  ```
- **Production Bundle Build:** Validate that Next.js optimizer compiles layout files cleanly:
  ```powershell
  npm run build
  ```

### 3. Mobile-First Verification Strategy
Mobile operational flows must be protected. Confirm the following on small-screen viewports (down to `320px` width):
- **Tap Targets:** Confirm all interactive elements (buttons, inputs, status dropdowns) maintain a height and width of at least `44px` with clear padding gaps.
- **Flex Wrap and Overflow:** Confirm that no flex rows or lists trigger horizontal scrollbars on mobile. All badges and texts must wrap cleanly.
- **Color Contrast:** Verify that HSL variable changes preserve a color contrast ratio of at least `4.5:1` for body text and headers against backgrounds in both light and dark mode modes.
