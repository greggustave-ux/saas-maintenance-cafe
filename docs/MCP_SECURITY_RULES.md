# MCP Security Rules & Governance - Welo Platform SaaS

This document establishes the security boundaries, environment separation policies, and human-in-the-loop approval workflows for all Model Context Protocol (MCP) integrations on Welo Platform.

---

## 🔒 Security Architecture: Human-in-the-Loop

To prevent data leakage, service disruption, and unauthorized schema changes, all sensitive actions require explicit human review and authorization.

```
[MCP Command Issued] ➔ [Security Boundaries Verification]
                              │
                              ├──► Banned Action? ➔ [TERMINATE & LOG]
                              │
                              └──► Sensitive Action? ➔ [PAUSE & AWAIT HUMAN APPROVAL]
                                                             │
                                                             ├──► Approved ➔ [EXECUTE]
                                                             └──► Rejected ➔ [REVERT & LOG]
```

---

## 🚫 MCP Permission Boundaries

The AI agent and associated MCP servers (Figma, Supabase, GitHub) must operate under a **least-privilege access model**.

### 1. Forbidden Actions (Strictly Prohibited for AI Automation)
- **Database Migrations:** Running migrations directly on staging or production database instances.
- **RLS Policy Modifications:** Altering or bypassing Row Level Security (RLS) configurations.
- **Destructive SQL Operations:** Executing `DROP`, `DELETE`, or `TRUNCATE` commands on any database tables.
- **User Administration:** Provisioning, de-provisioning, or changing credentials of active user accounts.
- **Production Deployment:** Triggering automatic production deployments (e.g. Vercel main branch) or pushing direct commits to production-ready branches.

### 2. Allowed Actions (Autonomous execution permitted)
- **Local Sandbox Execution:** Querying, creating, or testing database tables and functions on a **local Docker instance** (`localhost`).
- **Read-Only Inspection:** Querying database schemas, table structures, and design tokens for analysis.
- **Component Mockups:** Generating and styling React/Next.js components on development branches.

---

## 🗄️ Supabase Security Constraints

To guarantee data isolation and database integrity, the Supabase integration must obey these policies:

- **RLS Mandatory:** Every table created or modified in any migration script must have Row Level Security enabled:
  ```sql
  ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;
  ```
- **Isolated Connection Keys:** The database key provided to local MCP testing must have restricted permissions. Never configure the server with the Supabase `service_role` (admin) key.
- **Input Validation:** All database triggers and stored RPC functions must perform type checking and parameter verification to prevent SQL injection.

---

## 🌐 Environment Separation Rules

Welo Platform enforces strict isolation between Local, Staging, and Production environments.

| Security Layer / Policy | Local Environment | Staging Environment | Production Environment |
| :--- | :--- | :--- | :--- |
| **API Keys / Secrets** | Mock keys / Dev variables | Isolated Staging Credentials | Production Vault Variables |
| **Database Access** | Local DB container / unrestricted | Staging DB / read-only / schema-sync | Production DB / Strict RLS / restricted access |
| **Deployment Gate** | None (Local execution) | PR merge validation checks | Manual Release Coordinator sign-off |
| **MCP Permissions** | Write access permitted on local | Read-only | Access Completely Prohibited |

---

## 🔄 Rollback & Recovery Strategy

- **Migration Rollbacks:** Every schema adjustment proposed in a database change ticket must be accompanied by an inverse rollback script.
- **Rollback Verification:** Before a pull request can be merged to staging, the rollback script must be successfully executed on the local development instance.
- **Dependent Safety:** Rollback scripts must check dependencies (views, triggers, and foreign keys) before dropping schema items.

---

## 📝 Audit Logging Strategy

To monitor all AI operations and integration tasks:
- **Git Commit Trails:** Every code generation or token sync executed via MCP must leave a distinct, human-readable commit message detailing the changed scope.
- **Workspace Logs:** All commands executed by local tasks or script processes must write execution outputs to the conversation logs inside `.system_generated/logs/transcript.jsonl`.
- **Secret Scan:** Regular automated scans must verify that no credentials or private access tokens have been written into the codebase.

---

## 📊 Operational Risk & Technical Debt Matrix

| Risk Scenario | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Token Leakage** (Figma/GitHub/Supabase keys) | Critical | Low | Keep all tokens out of files. Use local OS environment variables only. |
| **Automatic Schema Corruption** | High | Medium | Completely block auto-migrations. Require manual script review before merge. |
| **Design-Code Drift** (Figma variables change) | Medium | High | Rely on structured tokens mapping and CSS custom properties; review style PRs manually. |
| **Enum Value Conflict** (Backend vs Frontend) | High | Medium | Mandate enum safety validation checklists in all database change tickets. |
| **Technical Debt** (Over-reliance on AI) | Medium | Medium | Peer code reviews must audit readability, CSS formatting, and component structure. |
