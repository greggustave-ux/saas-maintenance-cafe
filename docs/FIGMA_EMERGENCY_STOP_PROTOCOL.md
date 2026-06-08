# Figma Emergency Stop Protocol - Welo Platform SaaS

This document establishes the Figma Emergency Stop Protocol for the Welo Platform. It defines stop triggers and disconnection procedures to protect the codebase and design variables from unauthorized modifications.

---

## 🚨 Figma Stop Triggers

The local MCP Figma inspection must immediately halt and disconnect if any of the following triggers occur:

| ID | Trigger Condition | Specific Indicator | Safety Action |
| :--- | :--- | :--- | :--- |
| **FST-01** | **Write Capability Detected:** The server exposes comments posting or node modifications tools. | `figma_post_comment` or edit tools appear in register. | Kill terminal session, revoke token. |
| **FST-02** | **Auto-Sync Ignition:** Automated updates attempt to apply style overrides without human approval. | Git changes detected inside `/src/` or `/app/`. | Hard reset codebase, lock git. |
| **FST-03** | **Credential Escalation:** The server requests admin roles or access tokens for other Figma files. | Consent popup prompting for project-wide write scopes. | Decline auth and revoke Figma token. |
| **FST-04** | **Code Export / Generation:** An AI subagent suggests generating React components or exporting code. | Proposed write actions to files. | Terminate task immediately. |
| **FST-05** | **Protected View Inspection:** An inspection query targets restricted screens without human approval. | Request mapping to `/admin/users` or signature pad nodes. | Cancel query execution. |

---

## 🛠️ Rollback & Disconnection Procedures

If a stop trigger is activated, the developer must execute this disconnection sequence immediately:

### 1. Kill Active Connection
- **Action:** Press `Ctrl + C` in the running terminal window to terminate the Antigravity task and shut down local MCP node processes.

### 2. Revoke Personal Access Token (PAT)
- **Action:** Log into the **Figma Developer Console**, find the token, and click **Revoke**.

### 3. Restore Local Workspace State
- **Action:** Run these command lines to clear any untracked modifications or layout shifts:
  ```bash
  git reset --hard HEAD
  git clean -fd
  ```

### 4. Audit Log Reporting
- **Action:** Add an incident entry in `/scratch/figma-audit.json` explaining the trigger that activated the stop protocol.

---

## 📂 Reference Guidelines
- **Figma Read-Only Governance:** [docs/FIGMA_READ_ONLY_GOVERNANCE.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_READ_ONLY_GOVERNANCE.md)
- **Inspection Boundaries:** [docs/FIGMA_INSPECTION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_BOUNDARIES.md)
- **Component Access Matrix:** [docs/FIGMA_COMPONENT_ACCESS_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_COMPONENT_ACCESS_MATRIX.md)
- **Inspection Audit Rules:** [docs/FIGMA_INSPECTION_AUDIT_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_AUDIT_RULES.md)
- **First Passive Inspection:** [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md)
- **Inspection Approval Flow:** [docs/MCP_INSPECTION_APPROVAL_FLOW.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_INSPECTION_APPROVAL_FLOW.md)
- **PDF UI Protection:** [docs/PDF_UI_PROTECTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PDF_UI_PROTECTION_RULES.md)
- **Mobile Critical Interactions:** [docs/MOBILE_CRITICAL_INTERACTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_CRITICAL_INTERACTION_RULES.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
