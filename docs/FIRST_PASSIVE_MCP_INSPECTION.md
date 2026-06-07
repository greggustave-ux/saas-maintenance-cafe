# First Passive Local MCP Inspection - Welo Platform SaaS

This document establishes the execution parameters, detailed steps, and safety rules for the first strictly passive local Model Context Protocol (MCP) inspection. It defines the validation workflow, explicit forbidden operations, and emergency stop triggers to protect the workspace from automated modifications.

---

## 🚫 Strictly Passive Scope & Limitations

The first inspection is confined to a strictly read-only, non-mutating discovery pass. No live synchronization, no write actions, and no code execution are permitted.

### 🟢 Allowed Inspection Scope
- **Target File:** Inspect exactly **one local test Figma file** key representing the UI tokens frame.
- **Node Analysis:** Inspect pages, layout frames, and child layout hierarchies inside the test file.
- **Design Tokens:** Inspect color values (specifically HSL/HSLA formats) and typography weights.
- **Component Metadata:** Discover registry annotations (e.g., node mappings).
- **Report Output:** Generate a local, read-only JSON audit file in `/scratch/figma-audit.json`.

### ❌ Explicit Forbidden Operations
To ensure the integrity of the Welo Platform SaaS, the following operations are strictly forbidden:
- **No Figma Mutations:** Creating, updating, or deleting nodes, variables, pages, styles, or canvases. Writing Figma comments is banned.
- **No Code Generation:** Auto-generating or altering React component code, JSX templates, typescript files, or styling hooks.
- **No React Mutations:** Overwriting or modifying any files under `/src/` or `/app/` directories.
- **No Supabase Access:** Database connections to Supabase (local, staging, or production) are completely disabled during this inspection phase.
- **No Production/Staging Credentials:** Storing, reading, or passing any staging or production API keys, database secrets, or admin roles.
- **No Deployment Permissions:** Triggering Vercel deployment hooks, pushing to Git branches (other than the designated preparation branch), or modifying CI/CD pipelines.

---

## 🔄 First Inspection Workflow

Developers must follow this strict sequence when running the first design inspection. Each step represents an approval gate:

```
[1. Sandbox Startup] ➔ [2. Credentials Check] ➔ [3. Permissions Check] ➔ [4. Passive Run] ➔ [5. Audit Generation] ➔ [6. Human Review] ➔ [7. Shutdown]
```

1. **Local Sandbox Startup:**
   - Launch the local sandbox environment. Ensure no production environment variables are active in the terminal session.
2. **Credential Validation:**
   - Verify that the local Figma token resolves correctly and has strictly read-only access.
3. **Permission Validation:**
   - Run a test connection command to confirm that write commands are blocked.
4. **Passive Inspection:**
   - Execute the discovery query on the single designated test Figma file to fetch styles and layout hierarchies.
5. **Audit JSON Generation:**
   - Compile discovered nodes and token values into a local `/scratch/figma-audit.json` file.
6. **Human Review Checkpoint:**
   - Halt execution. The developer manually inspects the JSON output for formatting compliance.
7. **Inspection Shutdown:**
   - Terminate the local MCP connection and clear cached session tokens.

---

## 🚨 Emergency Stop Rules & Triggers

To prevent visual regressions, unauthorized writes, or credential leaks, the inspection must immediately shut down if any of the following triggers are met:

| ID | Trigger Condition | Execution Constraint | Emergency Action |
| :--- | :--- | :--- | :--- |
| **EST-01** | **Write Success:** An MCP command successfully writes, edits, or deletes any Figma or codebase property. | Any mutating response from Figma API. | Immediate process halt and key revocation. |
| **EST-02** | **Source File Mutation:** Any file inside `/src/` or `/app/` is modified or created by an automated routine. | Write detection on local filesystem code files. | Halt process, restore files via `git checkout`. |
| **EST-03** | **Supabase DB Access:** Any query execution attempt on local/staging/production database ports. | Database driver invocation or query connection. | Block port and terminate process. |
| **EST-04** | **Deployment Leak:** Pushing commits to `main` or triggering Vercel build integrations. | Git activity on protected branches or CI triggers. | Terminate process and lock repository pushes. |
| **EST-05** | **Sync Hook Trigger:** An automated git commit is generated or a merge is attempted by the AI subagent. | Auto-commit or auto-push trigger. | Kill terminal process, undo local commit. |

### 🛠️ Emergency Halt Procedure
If any emergency stop trigger is activated, follow these steps immediately:
1. **Kill the Process:** Press `Ctrl + C` in the running terminal to terminate the Antigravity task.
2. **Revoke Access Tokens:** Log into the **Figma Developer Console** and revoke the personal access token.
3. **Restore Code Base:** Run `git reset --hard` and `git clean -fd` to remove any untracked or modified files.
4. **Log Incident:** File an entry in the audit trail explaining the trigger that caused the shutdown.

---

## 📂 Reference Integration Guidelines

Refer to these architectural documents for specific implementation details:
- **First Connection Checklist:** [docs/MCP_FIRST_CONNECTION_CHECKLIST.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIRST_CONNECTION_CHECKLIST.md)
- **Inspection Approval Flow:** [docs/MCP_INSPECTION_APPROVAL_FLOW.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_INSPECTION_APPROVAL_FLOW.md)
- **Security Rules & Governance:** [docs/MCP_SECURITY_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_SECURITY_RULES.md)
- **Figma Permission Boundaries:** [docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md)
- **Audit Output Spec:** [docs/MCP_AUDIT_OUTPUT_SPEC.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_AUDIT_OUTPUT_SPEC.md)
- **Local Sandbox Setup:** [docs/MCP_LOCAL_SANDBOX_SETUP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_LOCAL_SANDBOX_SETUP.md)
- **MCP Setup Checklist:** [MCP_SETUP_CHECKLIST.md](file:///c:/Users/Dylan/Documents/welo_platform/MCP_SETUP_CHECKLIST.md)
