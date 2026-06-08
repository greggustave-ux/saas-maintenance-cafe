# MCP First Connection Checklist - Welo Platform SaaS

This checklist defines the step-by-step verification rules to execute before running the first passive inspection query on Welo Platform. It guarantees that the sandbox environment is properly configured, isolated, and strictly read-only.

---

## 📋 Pre-Connection Verification Steps

Before starting the MCP servers, the developer must verify each of the following checklist items:

### 1. Token Scope Audit
- [ ] **Read-Only Scope Enforcement:** Log into the **Figma Developer Console**, inspect the Personal Access Token, and verify it is configured with **strictly read-only permissions** (e.g., `file_read` scope only).
- [ ] **No Write/Edit Scopes:** Confirm that write/edit scopes (such as `file_write`) are unchecked.
- [ ] **GitHub Access Token Bounds:** Confirm that the token associated with `GITHUB_PERSONAL_ACCESS_TOKEN` is constrained to public repositories or read-only repository search scopes.

### 2. Configuration Inspection
- [ ] **No Database Strings:** Open the configuration file `C:\Users\Dylan\.gemini\antigravity-ide\mcp_config.json` and verify that no database connection strings or keys are hardcoded in the variables.
- [ ] **Endpoint Mapping:** Confirm the Figma server endpoint is mapped correctly to `https://mcp.figma.com/mcp`.
- [ ] **GitHub Server Mapping:** Ensure the GitHub MCP server is configured to run locally using `npx` with `@modelcontextprotocol/server-github`.

### 3. Environment Variable Sandbox
- [ ] **No Admin Credentials:** Run `env` or check system properties to confirm that no administrative credentials or API tokens for staging/production (e.g., Supabase service role keys or Vercel production deployment tokens) are active in the shell.
- [ ] **Sandbox Mode Enabled:** Ensure that the local test Figma file key is set to a restricted test node.

---

## 🧪 Connection Test Sequence & Approval Gates

Execute these validation commands sequentially. If any step fails or behaves unexpectedly, execute the **Emergency Stop Procedure**:

- [ ] **Step 1: Check Tool Availability**
  - Verify that only read-only Figma tools (`figma_get_file`, `figma_get_nodes`) appear in the Antigravity tool registry.
  - **Gate:** Flag and reject if any component generation, commenting, or design editing tools are listed.
- [ ] **Step 2: Passive Connection Ping**
  - Run a read-only query fetching variables from the designated test Figma file key.
  - Verify that the response returns a valid design-token variable payload.
- [ ] **Step 3: Mutation Block Verification**
  - Attempt to execute a mock write action (e.g., write comments on a node).
  - **Gate:** Verify that the API immediately returns an authorization error: `"Access Denied: Read-only scope enforced"`. If the write action succeeds, trigger **EST-01** immediately.

---

## 🚦 Network Logs Monitoring

During the initial connection, monitor outgoing network traffic to ensure no data leaks or external connections occur:

- [ ] **Host Verification:** Open terminal logs and verify that all outgoing HTTP requests are directed exclusively to Figma's API endpoints (`api.figma.com`).
- [ ] **Banned Connections:** Ensure no network calls are initiated to production database ports, Vercel endpoints, or external code-generation models.
- [ ] **Network Lock Down:** Flag and report any unauthorized API routing.

---

## 🚨 Emergency Stop Integration
Refer to [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md#L51-L62) for the exact triggers and halt procedures.

---

## 📂 Reference Integration Guidelines

Refer to these architectural documents for specific implementation details:
- **First Passive Inspection:** [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md)
- **Inspection Approval Flow:** [docs/MCP_INSPECTION_APPROVAL_FLOW.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_INSPECTION_APPROVAL_FLOW.md)
- **Security Rules & Governance:** [docs/MCP_SECURITY_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_SECURITY_RULES.md)
- **Figma Permission Boundaries:** [docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md)
- **Audit Output Spec:** [docs/MCP_AUDIT_OUTPUT_SPEC.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_AUDIT_OUTPUT_SPEC.md)
- **Local Sandbox Setup:** [docs/MCP_LOCAL_SANDBOX_SETUP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_LOCAL_SANDBOX_SETUP.md)
- **MCP Setup Checklist:** [MCP_SETUP_CHECKLIST.md](file:///c:/Users/Dylan/Documents/welo_platform/MCP_SETUP_CHECKLIST.md)
