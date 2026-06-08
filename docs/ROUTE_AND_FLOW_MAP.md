# Route & Flow Map - Welo Platform SaaS

This document maps the Next.js app routes, role-based authorization parameters, and core business workflows of the Welo Platform SaaS. It details how users interact with the system and where critical data transformations occur.

---

## 🚦 Next.js Routing Map

The application is structured around Next.js App Router folders. Access is dynamically restricted at the middleware layer based on database profiles.

| Path | Access Tier | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `/login` | Public | Unauthenticated | Sign-in page for all roles. |
| `/register` | Public | Unauthenticated | Sign-up page (default role is `technician` upon signup). |
| `/awaiting-approval` | Pending | All unapproved profiles | Landing page for newly registered users awaiting admin approval. |
| `/blocked` | Suspended | Blocked status profiles | Account suspended screen. |
| `/rejected` | Suspended | Rejected status profiles | Account registration rejected screen. |
| `/dashboard` | Approved | `admin`, `dispatcher`, `technician` | Welcome landing dashboard. |
| `/dashboard/service-calls` | Approved | `admin`, `dispatcher`, `technician` | Lists active service calls. Technicians are restricted to calls matching their full name. |
| `/dashboard/service-calls/[id]` | Approved | `admin`, `dispatcher`, `technician` | Detailed service call page. Technicians can only access if assigned. |
| `/dashboard/service-calls/archives` | Approved | `admin`, `dispatcher` | Review panel for archived service calls. |
| `/dashboard/dispatch` | Approved | `admin`, `dispatcher` | Kanban board layout for prioritizing and assigning calls. |
| `/dashboard/operations` | Approved | `admin`, `dispatcher` | Operational analytics, charts, and KPI dashboard. |
| `/dashboard/clients` | Approved | `admin`, `dispatcher`, `technician` | View registered client lists and client equipment. |
| `/dashboard/inventory` | Approved | `admin`, `dispatcher`, `technician` | View spare parts stock. |
| `/admin/users` | Administrative | `admin` only | Approves user profiles, updates roles, and suspends profiles. |

---

## 🔒 Authentication & Authorization Touchpoints

Routing boundaries are enforced by these touchpoints:
- **Edge Middleware ([src/middleware.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/middleware.ts)):** Runs on every matching request. Intercepts sessions, grabs user ID, queries the database table `profiles` for `approved`, `role`, and `status`, and routes the client accordingly.
- **Client Supabase Provider ([src/lib/supabase-client.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/lib/supabase-client.ts)):** Provides the browser-side database client context for inline state refresh.
- **Role checks in pages:** In addition to middleware, page elements like navigation sidebars ([app/dashboard/dashboard-shell.tsx](file:///c:/Users/Dylan/Documents/welo_platform/app/dashboard/dashboard-shell.tsx)) check the fetched `userRole` to conditionally show/hide the Dispatch, Operations, or User Management links.

---

## 🔄 Core Business Flows

The platform coordinates nine primary operational flows:

### 1. Service Call Creation
- **Trigger:** Dispatcher or admin clicks "New Call" on `/dashboard/service-calls`.
- **Implementation:** Opens `NewServiceCallForm` inside a modal. Submitting the form calls `createServiceCall` in the services layer, inserting the record into the `service_calls` table with status set to `new` and priority defaulted to `medium`.

### 2. Dispatch Assignment
- **Trigger:** Dispatcher drags cards on `/dashboard/dispatch` or modifies the select input in `/dashboard/service-calls/[id]`.
- **Implementation:** Calls `updateServiceCallTechnician`. If a technician is selected, the status updates to `assigned`; if removed, the status resets to `new`.

### 3. Technician Intervention
- **Trigger:** Technician logs into `/dashboard/service-calls` on mobile, clicks an assigned call, and clicks "Start Intervention".
- **Implementation:** Updates status to `in_progress` in the database. Opens note textarea, part inputs, photo uploaders, and signature forms.

### 4. Status Updates
- **Trigger:** Technician clicks status buttons or dispatcher updates the Kanban column.
- **Implementation:** Handled by `updateServiceCallStatus` inside [src/modules/service_calls/services/index.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/services/index.ts). Transitions trigger datetime recording:
  - `completed` triggers `completed_at = new Date()`.
  - `closed` triggers `closed_at = new Date()`.

### 5. PDF Report Generation
- **Trigger:** User clicks "Télécharger le PDF" on `/dashboard/service-calls/[id]`.
- **Implementation:** Controlled by `handleDownloadPdf` hook in [src/modules/service_calls/hooks/index.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/hooks/index.ts). Renders the off-screen layout block `#pdf-print-template` into a canvas using `html2canvas-pro` and saves it using `jspdf`.

### 6. Photo Upload
- **Trigger:** Technician captures or uploads a photo inside `PhotosSection` on `/dashboard/service-calls/[id]`.
- **Implementation:** Calls `uploadInterventionPhoto` service. Compresses the photo file, uploads it to Supabase Storage bucket `service-photos`, and inserts a record in `service_call_photos` referencing the public URL.

### 7. Signature Capture
- **Trigger:** Client draws on the canvas element in `SignatureSection`.
- **Implementation:** Calls `uploadClientSignature`. Renders the canvas as a PNG blob, uploads it to storage, updates `signature_url` in the `service_calls` table, and locks background viewport scrolling.

### 8. Machine History
- **Trigger:** Viewing `/dashboard/service-calls/[id]`.
- **Implementation:** Queries the database using `getServiceCallsByMachineSerial` for the serial number of the active call. Renders a historic list of all interventions for the client's asset.

### 9. Dashboard KPI Tracking
- **Trigger:** Viewing `/dashboard/operations`.
- **Implementation:** Queries `getDetailedServiceCalls` to render charts detailing closed calls, average intervention duration, and open ticket counts.

---

## 📂 Reference Guidelines
- **Project Inventory:** [docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PASSIVE_LOCAL_PROJECT_INVENTORY.md)
- **Component Inventory:** [docs/COMPONENT_INVENTORY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/COMPONENT_INVENTORY.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
