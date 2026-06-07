# UI Component Gap Analysis - Welo Platform SaaS

This document establishes the UI Component Gap Analysis for Welo Platform. It identifies token gaps, catalogues reusable components, details inline patterns to extract, and defines missing primitives.

---

## 🎨 Token Drift Analysis

A comprehensive comparison between the TypeScript design-system token definitions (`src/design-system/tokens/`) and the root CSS rules ([app/globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css)) reveals significant token drifts. These variables are declared in TypeScript token helpers but are entirely missing from the CSS root:

### 1. Spacing Gaps (`spacing.ts`)
- **Missing in CSS:** `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`
- **Impact:** Spacing sizes default to browser fallbacks, preventing a uniform grid.

### 2. Radius Gaps (`radius.ts`)
- **Missing in CSS:** `--radius-sm`, `--radius-md`, `--radius-lg`
- **Impact:** Only `--radius-xl` and `--radius-2xl` are defined. Visual elements like badge corners lack proper rounding rules.

### 3. Typography Gaps (`typography.ts`)
- **Missing in CSS:** `--font-size-sm`, `--font-size-base`, `--font-size-md`, `--font-size-lg`, `--font-size-xl`
- **Impact:** Text rendering relies on custom Tailwind sizing classes, presenting formatting drifts.

### 4. Touch Target Gaps (`touchTargets.ts`)
- **Missing in CSS:** `--touch-target-min`, `--touch-spacing-min`
- **Impact:** Buttons and dropdown components cannot query spacing variables directly, risking failing mobile WCAG access checks.

### 5. Status Color Gaps (`colors.ts`)
- **Missing in CSS:** `--status-pending`, `--status-active`, `--status-completed`, `--status-blocked`
- **Impact:** Component badges fall back to Tailwind color classes inside component code.

---

## 📦 Reusable UI Components Status

The following components are fully extracted and ready to participate in token syncs:
- **Form Controls:** `DSFormSection`, `DSInput`, `DSLabel`, `DSSelect`, `DSTextarea`, `DSValidationMessage`.
- **Badges:** `StatusBadge`, `PriorityBadge`.
- **Navigation:** `MobileBottomNavigation`.
- **Indicators:** `OfflineSyncIndicator`.

---

## 🔍 Inline UI Patterns to Extract

Several screens render complex layout patterns inline instead of importing reusable widgets. These should be refactored into design-system primitives:

### 1. Modals and Confirmation Dialogs
- **Found in:** `/app/admin/users/page.tsx` (modals for confirming role updates and user approval actions).
- **Extraction Candidate:** `DSModal.tsx` / `DSConfirmDialog.tsx`.

### 2. Loading Skeletons
- **Found in:** `/app/dashboard/service-calls/page.tsx` and `/app/dashboard/service-calls/[id]/page.tsx`.
- **Extraction Candidate:** `DSSkeleton.tsx` (with properties for lines, card blocks, and circular timelines).

### 3. Key-Value Description Lists
- **Found in:** `/app/dashboard/service-calls/[id]/page.tsx` (detail lists for address, machine serials, technician names, and timestamps).
- **Extraction Candidate:** `DSDescriptionList.tsx` / `DSKeyValueRow.tsx`.

### 4. Data Tables
- **Found in:** `/app/admin/users/page.tsx` (lists of users, approval checkboxes, and user metadata columns).
- **Extraction Candidate:** `DSTable.tsx`.

---

## 🛠️ Missing Design-System Primitives

To achieve full design system alignment, the project requires the creation of these new base primitives:
- **`DSButton.tsx`:** Renders button elements utilizing theme variables (like `var(--primary)`) with comfortable touch padding.
- **`DSCard.tsx`:** Standard container wrapper setting card border styles and shadows.
- **`DSOverlay.tsx`:** Portal modal backdrop supporting keyboard trap focuses.

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
- **Readiness Audit:** [docs/DESIGN_TO_CODE_READINESS_AUDIT.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_TO_CODE_READINESS_AUDIT.md)
