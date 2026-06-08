# GitHub Actions CI/CD Roadmap - Welo Platform SaaS

This document defines the automated validation roadmap for Welo Platform. To prevent technical debt and operational risk, these automated workflows will validate code quality, database safety, mobile usability, and accessibility before any branch can be merged to `staging` or `main`.

---

## 🚀 Workflow Architecture Overview

We propose a multi-stage validation pipeline triggered by Pull Requests and branch updates:

```
[Lint & Format] ──┐
[TS Type Check] ──┼─➔ [Build Check] ─➔ [Supabase Schema Verify] ─➔ [a11y Preview Audit] ─➔ [Deploy]
[Unit Testing]  ──┘
```

---

## 🛠️ Proposed Workflows

### 1. Build & Lint Validation (`ci-frontend.yml`)
- **Trigger:** Pull requests targeting `staging` or `main`.
- **Purpose:** Ensure formatting standards, code styles, and compilation integrity.
- **Steps:**
  1. **Checkout Code:** Use `actions/checkout@v4`.
  2. **Setup Node.js:** Use `actions/setup-node@v4` with caching enabled for `npm`.
  3. **Install Dependencies:** `npm ci`.
  4. **Linting Check:** Execute `npm run lint` (errors fail the build).
  5. **TypeScript Compilation:** Execute `npx tsc --noEmit` to verify type safety.
  6. **Production Build:** Execute `npm run build` to catch bundler, chunking, or static compilation issues.

### 2. Supabase Database Validation (`ci-database.yml`)
- **Trigger:** Pull requests containing files matching `**/*.sql` or changes inside the db modules.
- **Purpose:** Ensure database migrations do not break existing tables, violate Row Level Security (RLS) standards, or lack rollbacks.
- **Steps:**
  1. **Checkout Code:** Use `actions/checkout@v4`.
  2. **Install Supabase CLI:** Set up Supabase environment via `supabase/setup-cli@v1`.
  3. **Start Local DB Instance:** Run `supabase start` using Docker.
  4. **Validate Migrations:** Run `supabase db test` or apply all migrations against the fresh local instance to verify syntax and sequence.
  5. **RLS Policy Audit:** Run custom SQL scripts to verify that every table has RLS enabled:
     ```sql
     SELECT tablename FROM pg_tables 
     WHERE schemaname = 'public' 
       AND rowsecurity = false;
     ```
     *Expectation:* Returns 0 rows. Any row returned fails the step.
  6. **Rollback Verification:** Attempt to execute the accompanying rollback SQL to ensure the database can return to its original state.

### 3. Visual & Accessibility (a11y) Auditing (`ci-a11y.yml`)
- **Trigger:** Pull Request Preview deployment completion (Vercel webhook).
- **Purpose:** Audit the live transient deployment for mobile responsive breaks and screen reader standards.
- **Steps:**
  1. **Wait for Preview URL:** Listen for the Vercel Preview URL from the deployment event.
  2. **Install Playwright/Puppeteer & Axe:** Initialize automated test clients.
  3. **Run Accessibility Audit:**
     - Execute `@axe-core/playwright` scanning across key entry points (`/login`, `/dashboard`, `/dashboard/dispatch`).
     - Any contrast violation or missing aria-label below WCAG AA standards fails the build.
  4. **Responsive Integrity Checks:**
     - Validate that page components do not trigger horizontal scrolling at `320px` width.
     - Verify touch target dimensions are at least `44x44px`.

---

## 📊 Deployment Integration Roadmap

### Preview Deployments (Automatic)
- Every PR automatically compiles a preview environment via Vercel.
- The Preview URL is dynamically written to the PR review checklist for manual validation.

### Staging Deployments (Automated on Push)
- **Trigger:** Merging a PR into `staging`.
- **Action:** Builds and deploys the application code to `staging.welo.app` and updates the staging Supabase project database schemas.

### Production Deployments (Protected Manual Release)
- **Trigger:** Release tag creation (e.g. `v1.2.0`).
- **Safety Boundary:** Requires a repository administrator to manually approve the environment workflow. Automated pipelines cannot deploy to `app.welo.app` without explicit human authorization.

---

## ⚠️ Safe Automation Rules
- **No Direct Migrations:** CI/CD will never apply migrations directly to the production database without human intervention.
- **Strict Checks:** If any step in the lint, TypeScript, database audit, or accessibility validation fails, the PR's merge button is disabled.
