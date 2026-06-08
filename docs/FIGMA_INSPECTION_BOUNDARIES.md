# Figma Inspection Boundaries - Welo Platform SaaS

This document establishes the Figma Inspection Boundaries for the Welo Platform. It defines the allowed file targets, network isolation rules, and restricted UI screens to ensure safety during passive inspection.

---

## 🔒 Allowed File Targets & Scopes

To prevent unauthorized inspection, the Figma API client must operate under strict spatial constraints:
- **Designated Test File:** Queries are locked to exactly **one local test Figma file** key representing the UI tokens frames.
- **Node Constraints:** The server is only authorized to read coordinates from children of specified token root frames (e.g. typography nodes, space frames, color variables panels).
- **No Broad Scanning:** Recursive scanning of unrelated files or team project directories is forbidden.

---

## 🌐 MCP Network Isolation Requirements

To guarantee environment separation and block data leaks, the local MCP server must enforce network constraints:
- **Exclusive API Routing:** All outgoing HTTP requests must be directed exclusively to Figma's API endpoints (`api.figma.com`).
- **No Third-Party Models calls:** The server must not dispatch design payload data to external AI engines, code generators, or deployment pipelines.
- **Blocking Write Methods:** Configure Figma server clients to disable comment posting, component creations, and node edits at the configuration layer.

---

## 🚧 Restricted Screens & Business Flows

Seven critical screens are designated as **Restricted Zones**. Passive inspection must never bypass approval checkpoints for these layouts:

### 1. Authentication Pages (`/login`, `/register`)
- **Reason:** Contain session cookies, login input boxes, and registration scripts. Visual redesigns risk breaking sign-in handlers.

### 2. Role Management Page (`/admin/users`)
- **Reason:** Manages database approvals. Layout changes can misalign security actions.

### 3. Dispatcher Board (`/dashboard/dispatch`)
- **Reason:** Drag-and-drop Kanban interface. Border alignment shifts directly impact drag coordinates.

### 4. Technician Mobile Workflow (`/dashboard/service-calls`)
- **Reason:** Renders critical technician tasks under mobile limits.

### 5. Service Call Detail Page (`/dashboard/service-calls/[id]`)
- **Reason:** Orchestrates photo uploads, part forms, and signature pads.

### 6. PDF/Report Boundaries (`#pdf-print-template`)
- **Reason:** Renders client visit reports. Any margin or size modifications break layout print formatting.

### 7. Signature Capture Flow (`SignatureSection`)
- **Reason:** Relies on canvas drawing handlers and touch scroll locks.

---

## 📂 Reference Guidelines
- **Figma Read-Only Governance:** [docs/FIGMA_READ_ONLY_GOVERNANCE.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_READ_ONLY_GOVERNANCE.md)
- **Component Access Matrix:** [docs/FIGMA_COMPONENT_ACCESS_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_COMPONENT_ACCESS_MATRIX.md)
- **Inspection Audit Rules:** [docs/FIGMA_INSPECTION_AUDIT_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_AUDIT_RULES.md)
- **Emergency Stop Protocol:** [docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md)
- **First Passive Inspection:** [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md)
- **Inspection Approval Flow:** [docs/MCP_INSPECTION_APPROVAL_FLOW.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_INSPECTION_APPROVAL_FLOW.md)
- **PDF UI Protection:** [docs/PDF_UI_PROTECTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PDF_UI_PROTECTION_RULES.md)
- **Mobile Critical Interactions:** [docs/MOBILE_CRITICAL_INTERACTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_CRITICAL_INTERACTION_RULES.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
