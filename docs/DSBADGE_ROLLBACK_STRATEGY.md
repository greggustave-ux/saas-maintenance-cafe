# DSBadge Rollback Strategy - Welo Platform SaaS

This document establishes the DSBadge Rollback Strategy for Welo Platform. It defines the regression triggers and rollback steps required to restore visual and structural layouts in the event of an migration failure.

---

## 🚨 Rollback Triggers

An immediate style or code rollback must be initiated if any of the following occurrences are detected during the staging or canary testing phases of the `DSBadge` migration:

| ID | Rollback Trigger | Specific Indicator | Safety Action |
| :--- | :--- | :--- | :--- |
| **BRT-01** | **Layout Overflow:** The badge container breaks grid wrapping, clipping client names. | Horizontal scrollbar appears on viewport widths < 360px. | Revert styling, restore margins. |
| **BRT-02** | **Contrast Violation:** The HSL colors variables do not satisfy WCAG requirements. | Color contrast ratio measures below 4.5:1. | Restore old Tailwind color values. |
| **BRT-03** | **PDF Render Failure:** PDF downloads fail or yield misaligned table cells. | Report layout overlaps or clips details. | Roll back template changes. |
| **BRT-04** | **Broken Status Transitions:** Dropdown selector clicks fail to update DB values. | Console logs print state update errors. | Restore legacy select wrapper code. |

---

## 🛠️ Step-by-Step Restoration Checklist

If a rollback trigger is activated, follow this sequence:

### 1. Revert Local Workspaces Changes
- **Action:** Restore modified files back to the last stable commit:
  ```bash
  git checkout HEAD -- docs/
  git checkout HEAD -- src/design-system/components/StatusBadge.tsx
  git checkout HEAD -- app/dashboard/service-calls/page.tsx
  ```
- **Action:** Clear any untracked or temp styles:
  ```bash
  git clean -df
  ```

### 2. Rollback Staging Deployments
- **Action:** If changes have been merged to `staging`, locate the commit hash of the merge, revert it, and deploy:
  ```bash
  git revert -m 1 <merge_commit_hash>
  git push origin staging
  ```

### 3. Deactivate Canary Feature Flags
- **Action:** If using feature flags, toggle `FLAG_DSBADGE_RECONCILIATION` to `false` in the configuration panel to restore the legacy template.

---

## 📂 Reference Guidelines
- **Extraction Plan:** [docs/DSBADGE_EXTRACTION_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_EXTRACTION_PLAN.md)
- **Risk Analysis:** [docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md)
- **Usage Inventory:** [docs/DSBADGE_USAGE_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_USAGE_INVENTORY.md)
- **Implementation Rules:** [docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md)
- **Figma to Component Correlation:** [docs/FIGMA_TO_COMPONENT_CORRELATION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_TO_COMPONENT_CORRELATION.md)
