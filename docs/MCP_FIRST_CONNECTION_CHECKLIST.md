# MCP First Connection Checklist - Welo Platform SaaS

This checklist defines the step-by-step verification rules to execute before running the first passive inspection query on Welo Platform. It guarantees that the sandbox environment is properly configured, isolated, and strictly read-only.

---

## 📋 Pre-Connection Verification Steps

### 1. Token Scope Audit
- [ ] Log into the **Figma Developer Console**.
- [ ] Inspect the access token used by the local MCP server.
- [ ] Confirm the token is configured with **strictly read-only permissions** (e.g., `file_read` scope only).
- [ ] Verify that write/edit scopes (e.g. `file_write`) are unchecked.

### 2. Configuration Inspection
- [ ] Open the global configuration file: `C:\Users\Dylan\.gemini\antigravity-ide\mcp_config.json`.
- [ ] Verify that no production database strings or keys are hardcoded in the variables.
- [ ] Confirm the Figma server endpoint is mapped correctly to `https://mcp.figma.com/mcp`.

### 3. Environment Variable Sandbox
- [ ] Run `env` or check system properties to confirm that no administrative credentials or API tokens for staging/production are active.
- [ ] Verify that the resolved `GITHUB_PERSONAL_ACCESS_TOKEN` is constrained to read-only repository search scopes.

---

## 🧪 Connection Test Sequence

Execute these validation commands sequentially:

- [ ] **Step 1: Check Tool Availability**
  - Verify that only read-only Figma tools (`figma_get_file`, `figma_get_nodes`) appear in the Antigravity tool registry.
  - Flag if any component generation or design editing tools are listed.

- [ ] **Step 2: Passive Connection Ping**
  - Run a read-only query fetching variables from the designated test Figma file key.
  - Verify that the response returns a valid design-token variable payload.

- [ ] **Step 3: Mutation Verification**
  - Attempt to execute a mock write action (e.g. write comments on a node).
  - Verify that the API immediately returns an authorization error: `"Access Denied: Read-only scope enforced"`.

---

## 🚦 Network Logs Monitoring

- [ ] Open terminal logs and monitor out-going HTTP requests during the connection.
- [ ] Verify that all requests are directed exclusively to Figma's API endpoints (`api.figma.com`).
- [ ] Flag and report any unexpected queries attempting to connect to external code generation engines or production staging servers.
