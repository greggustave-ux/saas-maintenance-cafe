# Figma Read-Only Governance - Welo Platform SaaS

This document establishes the Figma Read-Only Governance framework for the Welo Platform. It defines the allowed scopes, forbidden design operations, restricted screens, and approval gates for future controlled Figma inspection sessions.

---

## 🔒 Scope of Read-Only Inspection

Figma inspection is restricted to passive, read-only metadata retrieval. Developers and AI subagents are permitted to extract formatting parameters to inspect alignment without mutating files.

### 🟢 Allowed Inspection Scopes
- **Spacing & Layout:** Extract padding, margin, width, height, and grid-gap parameters.
- **Typography:** Read font sizes, families, letter spacings, and font weights.
- **Component Hierarchies:** Inspect child node listings, groups, and auto-layout orientations.
- **Token Naming:** Inspect naming conventions of color variables and variables collections.
- **Allowed Object Types:** `DOCUMENT`, `PAGE`, `FRAME`, `GROUP`, `VECTOR`, `TEXT`, `COMPONENT`, `COMPONENT_SET`, `INSTANCE`.

### ❌ Forbidden Operations
The following operations are strictly prohibited:
- **Component Mutations:** Editing components, variants, or properties inside Figma canvases.
- **Auto-Layout Modifying:** Changing alignment, padding, or wrapping parameters in Figma layout groups.
- **Token/Style Rewriting:** Editing, renaming, or deleting Figma variable collections or color styles.
- **Sync & Publish Actions:** Publishing component library updates, merging Figma branches, or triggering automatic synchronization scripts.
- **Code Generation & Exports:** Utilizing Figma Dev Mode code exports or auto-generating React/CSS files.

---

## 🚧 Approval Gates

Before any connection to the Figma API is established, the developer must clear five strict human-in-the-loop approval gates:

### 1. Pre-Connection Gate
- **Requirement:** Human approval before establishing the initial local MCP config or activating Figma servers.

### 2. Pre-Session Gate
- **Requirement:** Human approval before launching each individual inspection task.

### 3. Scope Expansion Gate
- **Requirement:** Human approval before altering the target Figma file key or requesting additional nodes.

### 4. Protected Screen Gate
- **Requirement:** Human approval before inspecting nodes mapping to protected functional zones (like signature pads or PDF print templates).

### 5. Configuration Gate
- **Requirement:** Human approval before modifying any global MCP parameters or token configurations.

---

## 🔄 Inspection Session Lifecycle

To ensure complete isolation, every inspection session must execute within a controlled lifecycle:

```
[1. Pre-Session Review] ➔ [2. Active Authenticate] ➔ [3. Passive Inspect] ➔ [4. JSON Export] ➔ [5. Teardown]
```

1. **Pre-Session Review:** Verify the Figma token lacks edit permissions. Confirm only read-only tools are visible.
2. **Active Authentication:** Establish connection using environment variable token inheritance. No credentials may be hardcoded.
3. **Passive Inspection:** Execute retrieval query targeting designated node coordinates.
4. **Local Audit Export:** Compile fetched styles into the local `/scratch/` directory.
5. **Teardown & Revocation:** Kill the terminal process and revoke the temporary Figma Personal Access Token.

---

## 📂 Reference Guidelines
- **Inspection Boundaries:** [docs/FIGMA_INSPECTION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_BOUNDARIES.md)
- **Component Access Matrix:** [docs/FIGMA_COMPONENT_ACCESS_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_COMPONENT_ACCESS_MATRIX.md)
- **Inspection Audit Rules:** [docs/FIGMA_INSPECTION_AUDIT_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_AUDIT_RULES.md)
- **Emergency Stop Protocol:** [docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md)
- **First Passive Inspection:** [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md)
- **Inspection Approval Flow:** [docs/MCP_INSPECTION_APPROVAL_FLOW.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_INSPECTION_APPROVAL_FLOW.md)
- **Consolidation Strategy:** [docs/DESIGN_SYSTEM_CONSOLIDATION_STRATEGY.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_CONSOLIDATION_STRATEGY.md)
- **PDF UI Protection:** [docs/PDF_UI_PROTECTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PDF_UI_PROTECTION_RULES.md)
- **Mobile Critical Interactions:** [docs/MOBILE_CRITICAL_INTERACTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_CRITICAL_INTERACTION_RULES.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
