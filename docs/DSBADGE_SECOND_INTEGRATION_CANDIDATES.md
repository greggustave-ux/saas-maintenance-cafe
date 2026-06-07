# DSBadge Second Integration Candidates - Welo Platform SaaS

This document identifies, audits, and classifies all remaining legacy badge components and inline styling contexts in the Welo Platform workspace to determine the safest next integration target.

---

## 📋 Inventory of Remaining Badge Usages

Our codebase audit identified the following remaining badge components and inline status styles:

### 1. Service Call Card Priority Display
- **Location:** [ServiceCallCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/ServiceCallCard.tsx#L47)
- **Current Component:** `<PriorityBadge priority={safePriority} className="text-[9px]" />`
- **Context:** Rendered inside lists on the service calls main index page and the archives page.
- **Classification:** **CONTROLLED**
  - **Preferred Traits:** Static display of priority values. No transactional hooks or database state modifiers.
  - **Risks:** Nested inside list rows, so any change in width or font sizes could slightly affect visual alignment of details cards.

### 2. Client Machine Status Spans
- **Location:** [page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx#L420-L432)
- **Current Component:** Inline `<span className={`... ${statusColor}`}>` mapping machine status values.
- **Context:** Rendered under the "Machines sur place" sidebar panel of the service call detail page.
- **Classification:** **CONTROLLED**
  - **Preferred Traits:** Passive read-only display. No transactional workflows or database state mutations.
  - **Risks:** Variants are `'active' | 'inactive' | 'in_repair' | 'replaced'`. These are not standard service call statuses, so they must map to `category="neutral"` or custom label text overrides.

### 3. Service Call Detail Page Badges
- **Location:** [page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx#L266) and [page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx#L318)
- **Current Component:** `<StatusBadge status={serviceCall.status} />` and `<PriorityBadge priority={...} />`.
- **Context:** Rendered in the main client detail panels of the Service Call page.
- **Classification:** **HIGH-RISK**
  - **Risks:** The detail page houses active signature flows, photos upload sections, and the `#pdf-print-template` element. Re-rendering or spacing shifts could misalign printable margins.

### 4. Kanban Dispatch Card Badges
- **Location:** [DispatchCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/dispatch/DispatchCard.tsx#L68-L70)
- **Current Component:** `<StatusBadge>` and `<PriorityBadge>`.
- **Context:** Rendered on cards in the Kanban grid.
- **Classification:** **BLOCKED**
  - **Risks:** Explicitly forbidden drag-and-drop dispatcher zone.

---

## 🎯 Selected Second Integration Target

> [!TIP]
> **Safest Second Candidate: Candidate 1 — Service Call Card Priority Display**
> - **File:** [ServiceCallCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/ServiceCallCard.tsx)
> - **Refactor Action:** Replace the legacy `<PriorityBadge priority={safePriority} className="text-[9px]" />` with `<DSBadge category="priority" variant={safePriority} className="text-[9px]" />`.
> - **Rationale:** This is a purely static, read-only prioritization display inside list cards. It bypasses print templates, signature scripts, auth barriers, and database mutators, making it the safest multi-context verification candidate.
