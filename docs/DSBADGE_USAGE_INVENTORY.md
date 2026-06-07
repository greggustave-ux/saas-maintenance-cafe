# DSBadge Usage Inventory - Welo Platform SaaS

This document establishes the DSBadge Usage Inventory for Welo Platform. It maps all current badge instances, variants, inline style duplications, and token dependencies in the codebase.

---

## 📋 Badge Instances & Locations

A passive search of the codebase identified the following badge usages:

### 1. Service Call List Page ([app/dashboard/service-calls/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/page.tsx))
- **Badge Type:** Status badge.
- **Implementation:** Hardcoded `getStatusColor` style helper (lines 21-42). Passes style class strings to `ServiceCallCard`.
- **Classification:** **HIGH-RISK** (duplication zone).

### 2. Service Call Detail Page ([app/dashboard/service-calls/[id]/page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx))
- **Badge Type:** Status and Priority badges.
- **Implementation:**
  - Imports `StatusBadge` and `PriorityBadge` from the design system.
  - Houses the off-screen printing template `#pdf-print-template` rendering plain text status values inside table columns.
- **Classification:** **CRITICAL** (rendering protection zone).

### 3. Service Call Card Component ([ServiceCallCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/ServiceCallCard.tsx))
- **Badge Type:** Status (selector wrapper) and Priority badges.
- **Implementation:** Passes `getStatusColor` string into the status select tag container. Imports `PriorityBadge` from the design system.
- **Classification:** **HIGH-RISK**.

### 4. Kanban Column / Cards ([DispatchCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/dispatch/DispatchCard.tsx))
- **Badge Type:** Status and Priority badges.
- **Implementation:** Renders custom tags for status and priorities inside Kanban columns.
- **Classification:** **HIGH-RISK**.

---

## 🎨 Token & Style Dependencies

Unifying these instances requires declaring and mapping these token variables:
- **`--radius-sm` (4px):** Applied to the corners of status pills.
- **`--status-pending`:** Applied to `new`, `assigned`, `on_the_way`, and `waiting_parts` border/text states.
- **`--status-active`:** Applied to `on_site` active border/text states.
- **`--status-completed`:** Applied to `completed` and `closed` border/text states.
- **`--status-blocked`:** Applied to `cancelled` and `blocked` border/text states.

---

## 📱 Mobile-Sensitive Contexts

- **Card Layout Overflows:** In `/dashboard/service-calls`, the Status Select badge is nested next to client names inside flex grid rows. If widths are set too wide, the badge clips client titles on devices under `360px`.
- **Badge Click Area:** Select menus wrapping badge styles must maintain safe click targets (`min-h-12`) to prevent adjacent link activation errors on mobile touch screens.

---

## 📂 Reference Guidelines
- **Extraction Plan:** [docs/DSBADGE_EXTRACTION_PLAN.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_EXTRACTION_PLAN.md)
- **Risk Analysis:** [docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_MIGRATION_RISK_ANALYSIS.md)
- **Rollback Strategy:** [docs/DSBADGE_ROLLBACK_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DSBADGE_ROLLBACK_STRATEGY.md)
- **Implementation Rules:** [docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/SAFE_UI_PRIMITIVE_IMPLEMENTATION_RULES.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
