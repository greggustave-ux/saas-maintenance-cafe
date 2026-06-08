# Project AI Rules - Welo Platform SaaS

These rules define the mandatory safety boundaries, security practices, and development guidelines that any AI agent must strictly follow when working on the Welo Platform codebase.

---

## 🛑 Mandatory Safety Constraints

> [!CAUTION]
> **No database migrations may be executed, and no production actions may be performed without explicit human review and approval. Failure to comply violates the project's core safety policies.**

### 1. Database & Migrations
- **Never** execute database migrations (including running `.sql` files or schema changes) against any environment without explicit human approval.
- **Never** modify Row Level Security (RLS) policies directly without explicit human approval and review of the security implications.
- **Never** execute queries that delete or drop data in production databases under any circumstances.

### 2. Deployment & Hosting
- **Never** trigger, configure, or run production deployments (e.g., via Vercel) without explicit human approval.
- **Never** push changes directly to branches configured for automatic production deployments (e.g., `main` or `production`) without prior human authorization.

### 3. Security & API Keys
- **Never** hardcode or write API keys, access tokens, client secrets, or private keys to any file within the workspace repository.
- **Always** use environment variables or external global configurations (e.g., global `mcp_config.json` for MCP servers) to store sensitive credentials.

### 4. MCP Coordination
- **Always** document any modifications made to MCP config files, connection schemas, or environment requirements in `MCP_SETUP_CHECKLIST.md`.
- **Always** test each MCP connection separately to ensure tools are properly loaded before utilizing them in automated workflows.

---

## 🛠️ Tech Stack & Coding Standards

### Frontend
- **Framework:** Next.js (Note the breaking changes and conventions in `node_modules/next/dist/docs/` as defined in `AGENTS.md`).
- **Styling:** Vanilla CSS is preferred for maximum flexibility. Do not use TailwindCSS unless explicitly requested.
- **Design System:** Maintain modern typography, glassmorphism elements, curated HSL color palettes, and micro-animations to keep the app premium.

### Backend & Integrations
- **Database:** Supabase (PostgreSQL)
- **External Tools:** GitHub (vcs/collaboration), Figma (design specs)

---

## 🔄 AI Agent Protocol

1. **Check Knowledge Items (KIs):** Before doing research or writing code, check the repository-specific KIs in `<appDataDir>\knowledge`.
2. **Propose and Plan:** For complex tasks, write an `implementation_plan.md` first and wait for explicit human approval before modifying files.
3. **Task Tracking:** Maintain `task.md` with progress states: `[ ]` (pending), `[/]` (in progress), `[x]` (completed).
4. **Validation:** Proactively verify all changes through manual or automated testing before concluding a task.
