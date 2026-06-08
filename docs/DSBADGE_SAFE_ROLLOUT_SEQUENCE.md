# DSBadge Safe Rollout Sequence - Welo Platform SaaS

This document establishes the DSBadge Safe Rollout Sequence for Welo Platform. It defines the step-by-step rollout execution checklist, rollback actions, and verification scope for the second integration phase.

---

## 📅 Step-by-Step Rollout Checklist

Follow this sequence during the implementation phase:

### 1. Verification of Clean Workspace
- **Action:** Confirm that there are no modified files in the codebase before starting.
  ```bash
  git status
  ```

### 2. Update Primitive Component Import & Usage
- **Action:** In [ServiceCallCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/ServiceCallCard.tsx):
  - Replace `import { PriorityBadge } }` with `import { DSBadge }`.
  - Re-route the usage `<PriorityBadge priority={safePriority} className="text-[9px]" />` to `<DSBadge category="priority" variant={safePriority} className="text-[9px]" />`.
  - Remove unused import of `StatusBadge`.

### 3. Run Quality Compilation Verifications
- **Action:** Run the compiler, linter, and build tools to check for errors:
  ```bash
  npx tsc --noEmit
  npm run lint
  npm run build
  ```

### 4. Perform Visual & Viewport Audits
- **Action:** Open lists in `/dashboard/service-calls` and `/dashboard/service-calls/archives`.
- **Action:** Verify margins, color tokens, and flex wrapping behavior under small screens.

---

## 🚨 Rollback & Restoration Checklist

If visual alignment shifts or type errors occur, initiate rollback immediately:

1. **Revert Component Changes:**
   ```bash
   git checkout HEAD -- src/modules/service_calls/components/ServiceCallCard.tsx
   ```
2. **Verify Registry Stability:** Ensure `component-registry.ts` is clean.
3. **Verify Build Status:** Run `npm run build` to confirm compilation recovery.
