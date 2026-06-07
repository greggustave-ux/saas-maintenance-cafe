# UI Inconsistency Tracker - Welo Platform SaaS

This document establishes the UI Inconsistency Tracker for Welo Platform. It logs styling drifts, inline layout duplications, fragile variables mappings, and mobile target failures.

---

## 🎨 Token & Spacing Drifts

1. **Badge Color Duplications:**
   - **File:** [app/dashboard/service-calls/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/page.tsx#L21-L42)
   - **Inconsistency:** The page defines a local helper `getStatusColor` mapping status strings directly to Tailwind color classes (e.g. `border-sky-200 bg-sky-50 text-sky-700`). This duplicates the logic in `StatusBadge.tsx` and bypasses the CSS tokens.
2. **Inline Typography Scaling:**
   - **File:** [app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx#L195-L197)
   - **Inconsistency:** Headers use Tailwind classes (`text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl`) instead of referencing typography tokens (`text-[var(--font-size-lg)]`).
3. **Hardcoded Input Styling Class:**
   - **File:** [app/dashboard/service-calls/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/page.tsx#L7-L8)
   - **Inconsistency:** Text fields declare a local string `inputClass` mapping borders and shadows inline. This overrides form token properties.

---

## 🔄 Duplicated UI Patterns

1. **Confirmation Overlays:**
   - **File:** [app/admin/users/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/admin/users/page.tsx)
   - **Inconsistency:** Displays custom confirmation dialog boxes for profile status changes and role updates entirely inline.
2. **Page Loading Skeletons:**
   - **File:** [app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx#L23-L118)
   - **Inconsistency:** Renders custom layout skeletons inline, duplicating components from list page loaders.

---

## ⚠️ Fragile & Mobile-Sensitive Mappings

1. **PDF Print Off-Screen template:**
   - **File:** [app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx#L574-L586)
   - **Inconsistency:** Uses absolute widths (`width: 794px` for A4 page sizing) and inline color mappings. Visual alignment tools must not modify these values.
2. **Signature Touch Area:**
   - **File:** `SignatureSection.tsx`
   - **Inconsistency:** Layout dimensions are computed using fixed pixel ratios.
3. **Mobile Navbar Click Zones:**
   - **File:** `MobileBottomNavigation.tsx`
   - **Inconsistency:** Touch sizes must be verified to ensure they exceed WCAG 2.1 AA tap zones.

---

## 📂 Reference Guidelines
- **Figma to Component Correlation:** [docs/FIGMA_TO_COMPONENT_CORRELATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_TO_COMPONENT_CORRELATION.md)
- **Token Correlation:** [docs/DESIGN_TOKEN_CORRELATION_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TOKEN_CORRELATION_AUDIT.md)
- **Component Mapping Registry:** [docs/COMPONENT_MAPPING_REGISTRY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_MAPPING_REGISTRY.md)
- **Future Alignment Plan:** [docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FUTURE_SAFE_COMPONENT_ALIGNMENT_PLAN.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
