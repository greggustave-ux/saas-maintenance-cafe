# First Passive Local MCP Inspection - Welo Platform SaaS

This document establishes the execution parameters, detailed steps, and safety rules for the first strictly passive local Model Context Protocol (MCP) inspection. It defines the validation workflow and safety triggers to protect the workspace from automated modifications.

---

## 🚫 Scope & Limitations

The first inspection is confined to a strictly read-only, non-mutating discovery pass:

### 🟢 Allowed Inspection Scope
- **Target File:** Inspect exactly **one local test Figma file** key representing the UI tokens frame.
- **Node Analysis:** Inspect pages, layout frames, and child layout hierarchies inside the test file.
- **Design Tokens:** Inspect HSL color values and typography weights.
- **Component Metadata:** Discover registry annotations (e.g., node mappings).
- **Report Output:** Generate a local, read-only JSON audit file in the workspace.

### ❌ Forbidden Operations
- **Figma Modifications:** Creating, updating, or deleting nodes, variables, or canvases.
- **Code Modifications:** Writing React component code or updating local stylesheet properties.
- **Registry Mutations:** Altering metadata blocks inside `src/design-system/registry/component-registry.ts` automatically.
- **DevOps Actions:** Pushing Git branches, creating commits, or deploying code to Vercel instances.

---

## 🔄 First Inspection Workflow

Developers must follow this strict sequence when running the first design inspection:

```
[Sandbox Startup] ➔ [Credentials Check] ➔ [Permissions Check] ➔ [Inspection Run] ➔ [Audit Generation] ➔ [Manual Review] ➔ [Shutdown]
```

1. **Local Sandbox Startup:**
   - Launch the local sandbox environment. Ensure no production environment variables are active.
2. **Credential Validation:**
   - Verify that the local Figma token resolves correctly and lacks edit scopes.
3. **Permission Validation:**
   - Run a test connection command to confirm that write commands return access denied.
4. **Passive Inspection:**
   - Execute the discovery query on the single designated test Figma file.
5. **Audit JSON Generation:**
   - Compile discovered nodes and token values into a local `/scratch/figma-audit.json` file.
6. **Manual Review Checkpoint:**
   - Halt execution. The developer manually inspects the JSON output for formatting compliance.
7. **Inspection Shutdown:**
   - Terminate the local MCP connection and clear cached session tokens.

---

## 🚨 Emergency Stop Rules & Triggers

To prevent visual regressions or credential leaks, the inspection must immediately shut down if any of the following triggers are met:

- **Trigger 1 (Write Detection):** The MCP server returns a success response for any write/mutate action test query.
- **Trigger 2 (Unexpected Mutation):** Any file inside Welo's `/src/` folder is modified or created by an automated routine.
- **Trigger 3 (Database Leak):** A connection to staging or production Supabase database hosts is detected.
- **Trigger 4 (Staging Leak):** A Vercel staging deployment webhook is triggered.
- **Trigger 5 (Auto-Sync Action):** An automated git commit is generated or a merge is attempted by the AI subagent.

If any of these conditions are met, developers must immediately terminate the terminal process (`Ctrl + C`) and revoke the Personal Access Tokens.
