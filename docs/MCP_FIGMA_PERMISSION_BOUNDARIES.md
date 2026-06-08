# MCP Figma Permission Boundaries - Welo Platform SaaS

This document establishes the security constraints and sandbox boundaries for Model Context Protocol (MCP) servers connected to the Welo Platform. It defines the allowed scopes, forbidden actions, and risk tiers to ensure absolute safety.

---

## 🚫 Forbidden Execution Scopes

The Welo Platform strictly forbids the following actions by any automated system, AI subagent, or remote MCP client:

1. **Modifying Figma Files:** Writing changes, updating master components, editing variables, or deleting pages inside Figma files.
2. **Modifying React Components (Auto-generation):** Direct overwrites of React components (`.tsx` or `.ts` files) or stylesheet configurations based on automated sync inputs.
3. **Modifying Supabase Database:** Executing SQL data definition language (DDL) migrations, schema adjustments, table drops, or index edits.
4. **Modifying Row-Level Security (RLS) Policies:** Editing, deleting, or disabling RLS policies, custom auth triggers, or security policies.
5. **Modifying Production UI Elements:** Changing production styling tags, dashboard layouts, or KPI scripts without manual developer review and staging QA.
6. **Automatic Synchronization Pipelines:** Direct automatic code updates triggered on Figma webhook updates. All sync steps must remain manual and approval-based.

---

## 🛡️ Risk Classification Matrix

All tools and operations supported by the MCP servers are classified into one of four risk tiers:

### 🟢 1. Read-Only Safe
- **Scope:** Read-only inspection of schemas, designs, components, and variables.
- **Allowed Tools:**
  - `figma_get_file`, `figma_get_nodes`, `figma_get_image`
  - `supabase_inspect_table`, `supabase_get_schema`
  - `github_search_code`, `github_get_issue`
- **Actions:** Safe to execute autonomously for code investigation and documentation audits.

### 🟡 2. Review-Required
- **Scope:** Operations that modify local source code, documentation files, or configurations within the local sandbox.
- **Allowed Tools:**
  - Git branch checkouts, commits, and local staging additions.
  - Writing documentation files (`.md`) inside the local directory.
- **Actions:** Requires manual developer validation of the proposed changes before merging or staging.

### 🔴 3. Blocked
- **Scope:** Actions that modify live data, security layers, or database structures in staging/production.
- **Forbidden Tools:**
  - `supabase_execute_query` (if writing/updating/deleting rows or schemas)
  - `figma_post_comment` or Figma file mutation APIs.
- **Actions:** Completely blocked on any staging or production environments. Attempts to invoke these tools will fail execution.

### ❌ 4. Production-Dangerous
- **Scope:** High-risk administrative actions that could cause data loss, credential leaks, or service disruption.
- **Forbidden Tools:**
  - Dropping tables, modifying RLS policies, modifying database owner roles.
  - Deleting repository branches or pushing commits directly to the `main` branch.
- **Actions:** Blocked at the configuration layer. Any credential token possessing these scopes is prohibited from loading.
