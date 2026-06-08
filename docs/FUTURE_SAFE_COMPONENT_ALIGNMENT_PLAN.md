# Future Safe Component Alignment Plan - Welo Platform SaaS

This document establishes the Future Safe Component Alignment Plan for the Welo Platform. It defines future extraction recommendations, migration sequencing, and validation gates before active design synchronization automation.

---

## 📈 Future Migration Sequencing

To prevent regressions, the alignment between Figma design variables and codebase styles must follow this sequence:

```
[Phase 1: Token Reconciliation] ➔ [Phase 2: Registry Updates] ➔ [Phase 3: UI Extraction] ➔ [Phase 4: Passive Audit Runs]
```

### 1. Phase 1: CSS Token reconciliation
- **Action:** Declare all missing spacing, radius, typography, and status variables in the CSS root of [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
- **Gate:** Automated builds must compile without error flags.

### 2. Phase 2: Component Registry Additions
- **Action:** Add metadata records for the seven unmapped codebase components in `component-registry.ts`.
- **Gate:** Register coordinates and Figma Node IDs for each component.

### 3. Phase 3: Extraction and Refactoring of Inline Pages
- **Action:** Refactor large page files (admin users page, detailed service page) by extracting tables, modals, skeletons, and description lists.
- **Gate:** Validate user role updates and PDF printing outputs manually.

### 4. Phase 4: Compliance Validation Audits
- **Action:** Execute passive audits to check font choices, colors, and touch-target dimensions.
- **Gate:** Run visual audits in a staging environment.

---

## 🔒 Blocked Alignment Zones
To protect backend logic, the following codebase areas are completely locked from automated styling updates:
- **Authentication & Authorization Redirection Guards:** [src/middleware.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/middleware.ts).
- **User Profile Status Modifiers:** Redirection rules in [app/admin/users/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/admin/users/page.tsx).
- **PDF visit summary generators:** Off-screen template `#pdf-print-template`.
- **Signature Canvas:** Gesture event listeners and drawing coordinates.

---

## 🚦 Human Approval Checkpoints

Before executing any design token extraction or component alignment tool, the developer must clear these approval gates:
1. **Gate 1:** Human approval before establishing connections to additional Figma projects.
2. **Gate 2:** Human approval before running automated CSS property substitutions.
3. **Gate 3:** Human approval before modifying components in the design system registry.
4. **Gate 4:** Human approval before launching Canary feature flag rollouts on staging.

---

## 📂 Reference Guidelines
- **Figma to Component Correlation:** [docs/FIGMA_TO_COMPONENT_CORRELATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_TO_COMPONENT_CORRELATION.md)
- **Token Correlation:** [docs/DESIGN_TOKEN_CORRELATION_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TOKEN_CORRELATION_AUDIT.md)
- **Component Mapping Registry:** [docs/COMPONENT_MAPPING_REGISTRY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_MAPPING_REGISTRY.md)
- **UI Inconsistency Tracker:** [docs/UI_INCONSISTENCY_TRACKER.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_INCONSISTENCY_TRACKER.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
