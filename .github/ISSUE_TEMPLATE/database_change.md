---
name: "🗄️ Database Change"
about: Propose database schema changes, migration files, or RLS modifications
title: "db: [Short Description]"
labels: ["database", "needs review"]
assignees: ""
---

## 🗄️ Proposed Database Adjustments
Describe the tables, columns, constraints, or RPC functions that need to be added or modified.

## 🔒 Row Level Security (RLS) & Policy Design
Explain the exact security constraints for the new/modified tables:
- **Table:** `[table_name]`
- **Select Policy:** (e.g., authenticated users can view their own data)
- **Insert Policy:**
- **Update Policy:**
- **Delete Policy:**

## 🛡️ Migration & Schema Changes
Provide the SQL drafts or outline the migration plan:
- **Migration File Name:** (e.g., `supabase_xxx_migration.sql`)
- **SQL Preview:**
```sql
-- Insert migration query preview here
```

## 🔄 Backward Compatibility Verification
- [ ] **No Destructive Drops:** Confirm that no existing active tables or columns are dropped or renamed in a way that breaks existing clients.
- [ ] **Nullable/Default Safety:** Newly added columns must be nullable or have a default value to prevent crashing older frontend versions still running in cache.
- [ ] **Views & RPC compatibility:** Verify that any modified functions/views do not break existing queries and are backward-compatible.

## 🛡️ Rollback & Dependency Verification
- **Reversal SQL:**
```sql
-- Rollback query preview
```
- [ ] **Rollback Tested:** Confirm that executing the rollback script has been tested and completes successfully on a local instance.
- [ ] **Dependency Safe:** Verify that dropping the new table/column will not break dependent database triggers, foreign keys, or materialized views.

## 🔠 Enum Safety Validation
- [ ] **No Value Removals:** Confirm that no existing values are removed from enum types.
- [ ] **Safe Additions:** If adding new values to an enum, verify that the application code has been updated to handle the new value safely without falling over (e.g., in switches or status matchers).
