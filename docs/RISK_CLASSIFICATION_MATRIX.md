# Risk Classification Matrix - Welo Platform SaaS

This document establishes the risk tiers and classification matrix for the Welo Platform SaaS codebase. It categorizes components, routes, and actions to dictate validation gates and guardrails prior to any future design alignments or active MCP integrations.

---

## 🚦 Risk Tier Definitions

All codebase areas and actions are mapped to one of four safety tiers:

```
[CRITICAL]  ➔ Database, security policies, auth, deployment keys, migrations (Auto-blocked)
    ▼
[HIGH]      ➔ Auth views, file uploads, canvas drawing, PDF generation, technician assignment
    ▼
[MEDIUM]    ➔ Layout boards, forms, mobile routing bars, client-side list displays
    ▼
[LOW]       ➔ Read-only badges, timelines, design tokens, text values
```

---

## 📊 Mapped Risk Areas

The table below classifies the core files and components of Welo Platform based on operational risk:

| Scope | Element / File | Tier | Primary Risk | Mitigation Guardrail |
| :--- | :--- | :--- | :--- | :--- |
| **Security & Auth** | `src/middleware.ts` | **CRITICAL** | Role bypass, session hijacking, routing loop errors. | Lock file from automated edits. Require manual developer verification of redirection rules. |
| **DB & Credentials** | `src/lib/supabase-client.ts` | **CRITICAL** | Key leakage, server-side client environment drift. | Never store keys in the repository. Use environment variable inheritance. |
| **Admin Controls** | `app/admin/users/page.tsx` | **HIGH** | Unapproved users gaining access, unauthorized role escalations. | Implement strict role checkers. Verify all dropdown selections trigger confirmation modals. |
| **Signatures** | `SignatureSection.tsx` | **HIGH** | Broken touch events on mobile, corrupted base64 uploads, view lock failures. | Verify canvas scaling parameters. Lock window scroll during signature drawings. |
| **Uploads** | `PhotosSection.tsx` | **HIGH** | Malicious file injection, memory leaks during compression, broken storage URLs. | Enforce type-checking boundaries (`image/jpeg` only). Restrict file sizes to < 5MB. |
| **PDF Reporting** | `handleDownloadPdf` hook | **HIGH** | CORS violations on external images, truncation of multi-page layouts. | Test template using off-screen static wrappers. Enforce absolute element widths. |
| **Kanban Layout** | `DispatchBoard.tsx` | **MEDIUM** | Broken columns on mobile screens, drag-and-drop synchronization lags. | Fall back to select inputs on viewports <= 768px. Implement optimistic UI state updates. |
| **Forms** | `NewServiceCallForm.tsx` | **MEDIUM** | Missing field validations, spacing drifts, layout overflows. | Ensure standard design system wrappers (`DSFormSection`) manage spacing grids. |
| **Mobile Nav** | `MobileBottomNavigation.tsx` | **MEDIUM** | Misaligned icons, touch areas under 48px, broken routes. | Verify tap bounds in chrome developer tools. Enforce fixed bottom safe area paddings. |
| **Badges & Lists** | `StatusBadge.tsx` | **LOW** | Font size deviations, incorrect background color tones. | Align colors with HSL tokens. Enforce font-family uniformity. |
| **Timelines** | `MachineHistorySection.tsx` | **LOW** | Broken chronological sorting, text clipping in cards. | Ensure ascending sort orders. Add flex-wrap parameters to text blocks. |

---

## 🛠️ General Mitigation Strategies & Guardrails

To prevent regressions during future development, developers must enforce the following rules:

### 1. Database Operations (CRITICAL)
- **Rule:** Never execute migration scripts (`.sql`) automatically.
- **Verification:** Database updates must run through the Supabase CLI locally and be reviewed by a human administrator before deployment.
- **RLS:** All new tables must declare `row level security` immediately.

### 2. File Uploads & Signatures (HIGH)
- **Rule:** Upload functions must check file metadata before sending blobs to Supabase Storage.
- **Verification:** Restrict storage bucket permissions so clients can only read and upload to their own directories.

### 3. Component Modifications (MEDIUM)
- **Rule:** Do not inline styles or margins.
- **Verification:** Align spacing and typography to Design System CSS custom variables (`var(--space-md)`, `var(--radius-lg)`).

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
