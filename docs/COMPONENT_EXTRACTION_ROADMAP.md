# Component Extraction Roadmap - Welo Platform SaaS

This document establishes the Component Extraction Roadmap for Welo Platform. It defines the safe extraction order for inline UI patterns and outlines the design token migration strategy.

---

## 📈 Safe Extraction Order

To minimize regression risks, component extraction must proceed from low-risk leaf elements to high-risk inline page components. Each stage serves as an approval gate:

```
[Stage 1: Tokens] ➔ [Stage 2: Badges] ➔ [Stage 3: Primitives] ➔ [Stage 4: Forms] ➔ [Stage 5: Features] ➔ [Stage 6: Layouts]
```

### 1. Stage 1: Design Token Migration (Lowest Risk)
- **Action:** Declare the missing CSS variables (spacing, radius, typography, status colors) in the root of [app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css).
- **Validation:** Confirm the Next.js app builds successfully without warnings.

### 2. Stage 2: Standardizing Badge Components (Low Risk)
- **Action:** Replace custom inline status spans in `/app/dashboard/service-calls/page.tsx` and detail cards with the `StatusBadge` and `PriorityBadge` components.
- **Validation:** Check status colors match HSL tokens in both light and dark display modes.

### 3. Stage 3: Base UI Primitives Creation (Medium Risk)
- **Action:** Implement stateless primitives: `DSButton.tsx`, `DSCard.tsx`, `DSEmptyState.tsx` in `src/design-system/components/`.
- **Validation:** Swap buttons on static screens first and verify padding measurements.

### 4. Stage 4: Input Controls Consolidation (Medium Risk)
- **Action:** Refactor custom CSS classes on text fields and dropdowns inside `NewServiceCallForm` and parts inputs to use `DSInput`, `DSSelect`, and `DSTextarea`.
- **Validation:** Verify error states display correctly.

### 5. Stage 5: Extracting Feature-Specific Sections (High Risk)
- **Action:** Register and standardize the style controls inside `SignatureSection`, `PhotosSection`, and `PartsSection`.
- **Validation:** Confirm signature captures, uploads, and calculations continue to function.

### 6. Stage 6: Inline Modal & Table Modularization (High Risk)
- **Action:** Refactor the users grid table and confirmation overlays in [app/admin/users/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/admin/users/page.tsx) into `DSTable` and `DSConfirmDialog`.
- **Validation:** Execute manual tests on user role updates and profile approvals.

---

## 🎨 Design Token Migration Strategy

To transition custom Tailwind utilities to design tokens:
1. **Declare Custom Variables:** Define the token schema in CSS:
   ```css
   :root {
     --space-md: 1rem;
     --font-size-base: 0.875rem;
   }
   ```
2. **Bind variables in Tailwind Theme Config:** Map the CSS properties into Tailwind's theme in `globals.css`:
   ```css
   @theme inline {
     --spacing-md: var(--space-md);
     --font-size-base: var(--font-size-base);
   }
   ```
3. **Refactor Code Styles:** Replace utility-specific classes (e.g. `p-4` or `text-sm`) with token classes (e.g. `p-[var(--space-md)]` or `text-[var(--font-size-base)]`).

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **UI Component Gap Analysis:** [docs/UI_COMPONENT_GAP_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_COMPONENT_GAP_ANALYSIS.md)
- **Mobile Field Usage Audit:** [docs/MOBILE_FIELD_USAGE_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_FIELD_USAGE_AUDIT.md)
- **Design System Alignment Plan:** [docs/DESIGN_SYSTEM_ALIGNMENT_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_ALIGNMENT_PLAN.md)
- **Consolidation Strategy:** [docs/DESIGN_SYSTEM_CONSOLIDATION_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_CONSOLIDATION_STRATEGY.md)
- **Priority Matrix:** [docs/UI_STANDARDIZATION_PRIORITY_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/UI_STANDARDIZATION_PRIORITY_MATRIX.md)
