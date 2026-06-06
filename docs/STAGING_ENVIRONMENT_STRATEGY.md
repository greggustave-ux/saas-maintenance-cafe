# Staging Environment Strategy - Welo Platform SaaS

This document establishes the staging architecture, boundaries, and validation workflow to ensure safe integration testing and release verification prior to production deployment.

---

## 🏗️ Isolated Staging Infrastructure

To prevent data contamination and operational risks, Staging utilizes separate hosted environments isolated from both Local sandbox containers and Production live environments.

### 1. Isolated Supabase Project
- **Direct Database Isolation:** Staging operates on a dedicated Supabase project instance (e.g. `welo-staging.supabase.co`) with its own schema, tables, and credentials.
- **Access Control:** Staging contains mocked seed data simulating actual fleet scenarios but never includes active customer PII or transaction keys.
- **Row Level Security (RLS):** Policies are actively verified on staging to mirror production security constraints.

### 2. Environment Variables & Separation
Staging configurations are managed via Vercel staging configurations and `.env.staging` files. No production keys (`service_role` or Stripe live tokens) are loaded under any circumstances.

---

## ⚡ Deployment Boundaries

```
[Developer PR] ➔ [Vercel Preview Deploy] ➔ [Merge to staging branch] ➔ [Staging Deploy (staging.welo.app)] ➔ [Manual QA] ➔ [Release Tag (main)]
```

- **Branch Targets:** The staging environment tracks the `staging` branch.
- **Auto-Sync Limits:** MCP connections running on staging must remain manual-approval-based. Automatic synchronization scripts are disabled.
- **No Direct Push:** Pushes to the `staging` branch are forbidden. Code must transition through pull request validation pipelines.

---

## 📸 Vercel Preview Deployments

- Every pull request targeting `staging` automatically triggers a transient Vercel Preview Deployment.
- Preview deployments utilize the Staging database with read-only credentials where possible.
- Preview URLs must be verified on a mobile simulator down to `320px` viewport width to check responsive integrity before merging.

---

## 🔄 Database Snapshot & Rollback Strategy

To recover quickly from failed integration testing:
- **Daily Schema Snapshots:** The Staging database structure is backed up daily.
- **Automated Rollback Scripts:** Every database migration file must have a corresponding rollback SQL script.
- **Rollback Test Requirement:** If a staging deploy encounters schema exceptions, the release coordinator executes the rollback commands to return the database to the previous daily snapshot state.
  ```sql
  -- Example rollback execution context
  BEGIN;
  DROP TABLE IF EXISTS public.new_technician_checklist CASCADE;
  COMMIT;
  ```

---

## 🧪 Staging Testing & Mobile Validation Workflow

### 1. Unified Integration Test Sequence
1. **Frontend Lint & Typecheck:** Run `npm run lint` and `tsc --noEmit`.
2. **Supabase Schema Match:** Validate staging schema against the repository's `.sql` migration files using Supabase CLI schema diff tools.
3. **API Integration Verification:** Validate authentication tokens and core dispatch board endpoints.

### 2. Mobile Validation Protocol
- **Touch-First Checks:** Verify all inputs, modals, and drawers support native tap actions and maintain targets >= 44x44px.
- **Scroll Physics:** Confirm that list containers utilize smooth `-webkit-overflow-scrolling` wrappers.
- **Offline Sync Simulation:** Simulate network throttling in Chrome DevTools to verify local cache queueing and resync performance.
