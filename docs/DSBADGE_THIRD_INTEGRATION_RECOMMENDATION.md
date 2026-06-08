# DSBadge Third Integration Recommendation - Welo Platform SaaS

This document establishes the DSBadge Third Integration Recommendation for Welo Platform. It defines the proposed third integration target, refactoring scope, and regression validation scope.

---

## 🎯 Proposed Third Integration Target

> [!TIP]
> **Recommended Target: Service Call Detail Page Header**
> - **File:** [page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx)
> - **Integration Scope:** Refactor the static status display and priority badge inside the detail page header panels.
>   - Replace `<StatusBadge status={serviceCall.status} />` with `<DSBadge category="status" variant={serviceCall.status} />`.
>   - Replace `<PriorityBadge priority={serviceCall.priority || "medium"} className="text-xs" />` with `<DSBadge category="priority" variant={serviceCall.priority || "medium"} className="text-xs" />`.

---

## 🚫 Critical Integration Rules

1. **Exclusion of PDF Print Templates:**
   - The hidden off-screen print template `#pdf-print-template` renders:
     ```html
     <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Statut: {serviceCall.status}</p>
     ```
   - **Do not refactor or replace this string.** It must remain plain text to prevent html2canvas/jspdf rendering errors.
2. **Exclusion of Dropdown Select Menus:**
   - Any priority selector menus used by admins or dispatchers to update states must keep their standard HTML `<select>` elements.
   - Do not replace option tags or select inputs with `DSBadge`.
3. **Rollback Safety:**
   - If visual alignment shifts, revert [page.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/service-calls/[id]/page.tsx) back to HEAD.
