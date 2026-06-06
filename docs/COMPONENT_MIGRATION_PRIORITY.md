# Component Migration Priority - Welo Platform SaaS

This document establishes the inventory audit of the legacy Welo Platform UI and defines the priority timeline for migrating legacy elements to the new Design System.

---

## 🔬 Current Production UI Audit

An analysis of the existing layout code reveals several styling inconsistencies and technical debt areas:

### 1. Duplicated Styles & Hardcoded Values
- **Colors:** Multiple raw HEX codes (e.g. `#0891b2`, `#0e7490`, `#22d3ee`) are written directly in components rather than using CSS variables.
- **Radii:** Borders use inconsistent rounded values (`rounded-md`, `rounded-lg`, `rounded-xl`) without semantic alignment.

### 2. Inconsistent Spacing & Status Colors
- Spacing padding values range from 12px to 20px on cards, causing minor vertical alignment drift.
- Status displays utilize variant backgrounds that lack high-contrast labels in dark-mode previews.

### 3. Mobile Responsiveness & Touch Targets
- Certain sidebar links and actions trigger standard web browser tap behaviors without overriding tap highlights.
- Small list actions (e.g., delete icons on uploaded photo grids) have touch targets smaller than 40px, raising mistap rates for field technicians.

---

## 📈 Migration Priority Hierarchy

To minimize technical risk, components are grouped into three priority rollout tiers:

```
[Priority 1: Core Badges & Nav] ➔ [Priority 2: Forms & Selectors] ➔ [Priority 3: Analytics Panels]
```

### 1. Priority Tier 1: Badges, Badging, and Navigation
- **Components:** `StatusBadge`, `PriorityBadge`, `MobileBottomNavigation`, `OfflineSyncIndicator`, and `ServiceCallCard` previews.
- **Rationale:** High visibility, zero database write mutations, and low structural complexity.
- **Timeline:** Current sprint.

### 2. Priority Tier 2: Interactive Forms & Action Panels
- **Components:** `SignatureCapture`, `PhotoUploadSection`, filters panels, and `TechnicianAssignmentPanel`.
- **Rationale:** Requires form validations, file uploads, and permissions checks.
- **Timeline:** Subsequent sprint, following Tier 1 validation.

### 3. Priority Tier 3: Analytics & Admin Dashboards
- **Components:** Chart wrappers, dispatcher Kanban board grid layout, report previews, and billing administration screens.
- **Rationale:** Data-rich complex components containing multiple layout grids, aggregations, and high screen widths.
- **Timeline:** Long-term roadmap.

---

## 📝 Completed Migrations Log

- **StatusBadge (v1.0.0):** Migrated as first safe candidate. Hardcoded status elements in `MachineHistorySection`, `OperationsDashboard`, and `ServiceCallDetails` have been replaced by the standardized `<StatusBadge>` component. No business logic or database interactions were altered.
- **PriorityBadge (v1.0.0):** Migrated as second safe candidate. Replaced static priority indicator spans in `ServiceCallCard` lists and `ServiceCallDetails` header cards with the standardized `<PriorityBadge>` component. No business logic or query structures were modified, and existing production status naming is fully preserved.

