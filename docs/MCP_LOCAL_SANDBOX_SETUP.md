# MCP Local Sandbox Setup - Welo Platform SaaS

This document establishes the architecture and configuration boundaries for the local-only Model Context Protocol (MCP) sandbox environment. It enforces isolation rules to ensure that all remote inspections remain read-only and safe.

---

## 🚫 Sandbox Isolation Boundaries

To protect remote servers, database records, and codebase integrity, the local sandbox is governed by three strict boundary rules:

1. **Local-Only Scope:** All MCP connections and tools operate strictly on your local machine. No live webhook connections are configured.
2. **Zero Credentials Policy:**
   - **No Production Access:** Administrative tokens, production DB secrets, and active API keys are completely banned from configuration files.
   - **No Staging Access:** Staging database access credentials and deployment webhook keys are excluded from sandbox environments.
3. **Sandbox Configuration Isolation:** The local `mcp_config.json` uses local-only commands and environment-variable resolution to prevent hardcoded key leakage.

---

## 📊 Capabilities Matrix

The table below defines the boundary between allowed inspection capabilities and forbidden mutation operations inside the local sandbox:

| Operation Type | Allowed Capabilities (🟢 Read-Only) | Forbidden Actions (❌ Blocked / Mutation) |
| :--- | :--- | :--- |
| **Figma API** | Inspect frame layout nodes<br>Inspect variant properties<br>Inspect color styles and typography<br>Discover variables and design tokens | Writing comments on designs<br>Modifying node structures in Figma<br>Deleting components or canvas frames<br>Automated synchronization |
| **React Workspace**| Compare local variables to design variables<br>Generate local audit summary reports<br>Inspect component metadata registries | Writing React code templates autonomously<br>Replacing styles in `.tsx` files automatically<br>Overwriting `globals.css` variable files |
| **Supabase DB** | Inspect schema configurations locally<br>Read table relations and columns | Writing database records or update queries<br>Applying SQL DDL migration files<br>Disabling RLS safety policies |
| **Git & DevOps** | Check current branch status<br>Inspect local change histories | Creating git branches autonomously<br>Generating and signing git commits<br>Triggering Vercel preview/production deployments |

---

## ⚙️ Local Sandbox Setup Verification

Before running audits, developers must verify the sandbox environment is properly isolated:

1. **Verify Config File:** Open `C:\Users\Dylan\.gemini\antigravity-ide\mcp_config.json` and ensure no production keys are written inline.
2. **Check Access Tokens:** Confirm that any environment variables (e.g. `GITHUB_PERSONAL_ACCESS_TOKEN`) resolved by local servers possess the minimal read-only scopes.
3. **Lock DB Queries:** Confirm that no hosted database secrets are exposed in local configuration variables.
