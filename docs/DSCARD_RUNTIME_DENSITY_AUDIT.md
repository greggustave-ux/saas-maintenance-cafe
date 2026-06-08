# DSCard Runtime Density Audit - Welo Platform SaaS

This document establishes the Runtime Density Audit for the modern `DSCard` primitive integration. It evaluates container heights, vertical margins, and text wraps to safeguard the density of operational layouts.

---

## 📊 Container Height & Layout Density Analysis

We audited the existing card implementations to establish baseline spacing thresholds. The visual modernization of cards must not degrade data density.

### 1. Service Call Cards (`ServiceCallCard.tsx`)
- **Current Layout Height:** Approximately `260px` to `310px` depending on address length and problem description.
- **Density Check Points:**
  - The padding is currently set to `var(--space-md)` (16px).
  - Replacing the main wrapper with `<DSCard padding="md">` will preserve the exact current margin density.
  - **Density Guideline:** The internal list spacing (e.g. `grid` gap, margins between rows) must remain at `var(--space-sm)` (12px) to prevent button action rows from sliding below the phone screen fold.

### 2. Machine History Intervention Cards (`MachineHistorySection.tsx`)
- **Current Layout Height:**
  - Closed/Collapsed state: `140px`
  - Expanded details state: `340px` to `420px`
- **Density Check Points:**
  - Cards inside the timeline column utilize `p-4` padding.
  - Converting these elements to `<DSCard padding="md" variant="outlined">` will maintain visual parity.
  - **Density Guideline:** Skeletons and empty states must reflect the exact spacing height of collapsed cards to prevent visual jumping during asynchronous data loading.

---

## 📱 Sizing Guardrails & Visual Density Policies

To keep layouts compact and clear, follow these strict sizing policies:

1. **Content Clamping:**
   - Descriptions and user notes inside `ServiceCallCard` and history rows must use CSS line clamping (e.g. `line-clamp-2`) to prevent vertical stretching from long text fields.
2. **Text Wrap Prevention:**
   - Critical data fields (such as machine serial numbers and technician names) must use `break-all` or `break-words` classes to avoid layout stretching.
3. **Margins & Gaps:**
   - Keep margin heights between grid columns to `gap-4` or below.
   - Do not add extra margins above or below titles. Typography should rely on relative spacing (`mt-0.5`, `mt-1`) to remain dense and legible.
