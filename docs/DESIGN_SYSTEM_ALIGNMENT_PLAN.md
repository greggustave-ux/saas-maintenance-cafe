# Design System Alignment Plan - Welo Platform SaaS

This document establishes the Design System Alignment Plan for Welo Platform. It defines a structured, phase-by-phase roadmap to reconcile design tokens and components between Figma assets and the Next.js React codebase without introducing visual or database regressions.

---

## 📅 Reconciliation Roadmap

Reconciliation must be executed sequentially. Progress to the next phase is blocked until all human review checkpoints are signed off.

```
[Phase 1: CSS Token Reconciliation] ➔ [Phase 2: Registry Mapping Updates] ➔ [Phase 3: Inline Refactoring] ➔ [Phase 4: Staged Validation]
```

### 1. Phase 1: CSS Token Reconciliation (CRITICAL)
- **Goal:** Declare all missing design tokens in the root stylesheet [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css) to align with the TypeScript definitions in `src/design-system/tokens/`.
- **Target Variables:**
  - Spacing (`--space-xs` to `--space-xl`).
  - Font sizes (`--font-size-sm` to `--font-size-xl`).
  - Corner radius (`--radius-sm` to `--radius-lg`).
  - Touch target size parameters (`--touch-target-min`, `--touch-spacing-min`).
  - Status indicator colors (`--status-pending`, etc.).
- **Human Gate:** Validate HSL values inside the CSS matches design specifications exactly.

### 2. Phase 2: Component Mapping & Registration
- **Goal:** Register all seven currently unmapped operational components in [src/design-system/registry/component-registry.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/design-system/registry/component-registry.ts).
- **Target Components:** `NewServiceCallForm`, `PartsSection`, `MachineHistorySection`, `PhotosSection`, `SignatureSection`, `DispatchBoard`, `DispatchColumn`.
- **Figma Alignment:** Map each component to its corresponding Figma node ID (e.g. `node-id=205:44` for parts items).
- **Human Gate:** Check that properties and states match the Figma definitions.

### 3. Phase 3: Refactoring Inline Page Layouts
- **Goal:** Modularize the large inline page files to prevent regression risks.
- **Targets:**
  - Extract admin modals and tables from [app/admin/users/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/admin/users/page.tsx) into separate widgets.
  - Extract description rows and skeletons from [app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx).
- **Human Gate:** Run manual regression testing on user profile status changes and PDF exports before pushing code changes.

### 4. Phase 4: Staged Validation & Token Audits
- **Goal:** Execute passive design-system compliance scans.
- **Target checks:**
  - Verify that no component classes override tokens with hardcoded color values.
  - Verify WCAG-AA contrast ratios on all elements.
  - Verify interactive element touch areas equal or exceed `44px`.
- **Human Gate:** Generate audit report JSON and verify zero warning flags are present.

---

## 🚦 Verification Criteria & Gates

All phases must verify compliance using these three gates:
1. **Visual Alignment Gate:** Review component paddings, margins, and borders against Figma assets in staging environment.
2. **Access Compliance Gate:** Run a touch-target check in Google Chrome's accessibility panel to confirm interactive buttons are accessible.
3. **Emergency Stop Gate:** Verify that no automated writes or database queries bypass safety layers. If a regression is detected, trigger an immediate process rollback.

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **UI Component Gap Analysis:** [docs/UI_COMPONENT_GAP_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_COMPONENT_GAP_ANALYSIS.md)
- **Mobile Field Usage Audit:** [docs/MOBILE_FIELD_USAGE_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_FIELD_USAGE_AUDIT.md)
