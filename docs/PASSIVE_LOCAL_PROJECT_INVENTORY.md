# Passive Local Project Inventory - Welo Platform SaaS

This document establishes a passive inventory of the Welo Platform SaaS codebase structure. It serves as a static blueprint mapping the local files, directory hierarchies, and system boundaries to prepare for future controlled Model Context Protocol (MCP) connections and design alignments.

---

## 🔒 Strict Phase Constraints

In alignment with safety rules, the Passive Local Project Inventory phase operates under **strictly passive local constraints**:
- **Zero Write Actions:** No modifications to source code files (`.tsx`, `.ts`, `.css`, etc.).
- **Zero Connections:** No active remote database access (Supabase client calls are mapped, but not executed). No Figma API connections or OAuth sessions.
- **Zero Synchronization:** No live token synchronization, components refactoring, or file deletion.
- **Zero Environment Changes:** No changes to secrets, variables, configuration parameters, or database tables.

---

## 📂 Project Directory Structure

Welo Platform uses the Next.js App Router layout coupled with a feature-module architecture under `/src`. Below is a static mapping of the root workspace elements:

```
welo_platform/
├── app/                           # Next.js App Router (pages and layouts)
│   ├── admin/                     # Admin user management and status approval
│   ├── api/                       # API endpoints (e.g., signup notification webhook)
│   ├── awaiting-approval/         # Waiting room for unapproved profiles
│   ├── blocked/                   # Landing page for blocked users
│   ├── dashboard/                 # Authed dashboard operations, clients, dispatch, technicians
│   ├── login/                     # Authentication login view
│   ├── register/                  # Authentication register view
│   ├── rejected/                  # Landing page for rejected profiles
│   ├── globals.css                # Global CSS styles
│   ├── layout.tsx                 # Root layout container
│   └── page.tsx                   # Default index page
│
├── docs/                          # Project design system, guides, and security documents
│
├── src/                           # Shared library, modules, types, and hooks
│   ├── design-system/             # Design-system tokens, components, form controls, and registry
│   │   ├── components/            # Reusable buttons, badges, nav bars, and forms
│   │   ├── offline/               # Offline caching and indicators
│   │   ├── registry/              # Component registry schemas and metadata
│   │   └── tokens/                # HSL color values, spacing parameters, typography, z-index
│   ├── hooks/                     # Custom React hooks (e.g., useServiceCallDetails)
│   ├── lib/                       # Third-party initializers (e.g., supabase-client)
│   ├── middleware.ts              # Route guards and role-based redirect logic
│   ├── modules/                   # Feature-based business components (e.g., service_calls)
│   ├── types/                     # Shared Typescript type definitions
│   └── utils/                     # Static helpers
│
├── MCP_SETUP_CHECKLIST.md         # MCP Server setup and configuration checklist
└── package.json                   # Project dependencies (e.g., @supabase/ssr, jspdf, html2canvas-pro)
```

---

## ⚡ Key Passive Discoveries

1. **Authentication & Routing Guards:**
   Routing safety is handled at the Next.js Edge middleware layer in [src/middleware.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/middleware.ts), which queries the profiles table to verify user statuses (`approved`, `blocked`, `rejected`) and roles (`admin`, `dispatcher`, `technician`).
2. **Business Component Isolation:**
   All core business modules reside in [src/modules/service_calls](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls). Unregistered components have been identified that require registration prior to any design token sync.
3. **Database Dependency Boundary:**
   The project communicates with Supabase through client wrappers in [src/lib/supabase-client.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/lib/supabase-client.ts) and service handlers in [src/modules/service_calls/services/index.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/services/index.ts). No raw credentials are hardcoded.

---

## 🚨 Emergency Stop Integration

If any automated routine attempts to bypass passive scope constraints during this phase, immediately execute the emergency stop:
1. Revoke active temporary tokens.
2. Hard kill the process (`Ctrl + C`).
3. Restore modifications via `git checkout .`.

For detailed triggers, see [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md#L51-L62).

---

## 📂 Inventory Map Index

Refer to these deliverables for detailed analysis:
- **Routes & Flow Map:** [docs/ROUTE_AND_FLOW_MAP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/ROUTE_AND_FLOW_MAP.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
- **MCP Setup Checklist:** [MCP_SETUP_CHECKLIST.md](file:///c:/Users/Dylan/Documents/welo_platform/MCP_SETUP_CHECKLIST.md)
