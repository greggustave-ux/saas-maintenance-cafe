# Figma-to-Welo Transfer Approval Gates - Welo Platform SaaS

This document establishes the Human Approval Gates and Verification Criteria for the progressive transfer of UI visual mockups from Figma to the Welo Platform production codebase.

---

## 🚦 Three-Stage Approval Gate Architecture

To prevent design updates from introducing operational regressions, every visual transfer session must pass through three distinct gate controls:

```
[Gate 1: Frame Target Selection] ➔ [Gate 2: Code Alignment Proposal] ➔ [Gate 3: Build Verification & PR Review]
```

### 1. Gate 1: Frame Target Selection Approval
- **Objective:** Lock the scope of the transfer session to a single isolated node or component frame.
- **Verification Method:**
  - Verify that the target frame does not belong to any **BLOCKED_ALIGNMENT** category (e.g. no dispatcher board cards, no PDF print layouts, no auth templates).
  - Ensure the target component can be mapped to an existing visual primitive or layout sheet.
- **Human Sign-Off Requirement:** The user must explicitly approve the selected Figma Node ID and target codebase file path before Antigravity executes any code analysis.

### 2. Gate 2: Code Alignment Proposal Approval
- **Objective:** Review the technical design plan, CSS variable maps, and file modification diffs.
- **Verification Method:**
  - Audit the proposed styling changes to ensure zero changes are made to react business hooks, data fetching layers, or backend integration endpoints.
  - Review risk classifications: Only targets marked as `SAFE` or `CONTROLLED` are approved for rollout.
  - Verify that token mappings reference CSS custom properties in [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css) rather than hardcoded style strings.
- **Human Sign-Off Requirement:** The user must review the proposed diff and write "Approved" before changes are written to the local filesystem.

### 3. Gate 3: Build Verification & PR Review Approval
- **Objective:** Confirm local stability, compilation cleanliness, and visual parity compliance.
- **Verification Method:**
  - **TypeScript compilation:** `npx tsc --noEmit` must complete with zero errors.
  - **Linter Check:** `npm run lint` must pass (confirming zero new styling issues are introduced).
  - **Visual Parity Evidence:** Verify the presence of BEFORE, AFTER, and mobile viewport screenshots, along with spacing density checks.
- **Human Sign-Off Requirement:** Git commits must be reviewed and signed off prior to merging the feature branch to origin.

---

## 📋 Approval Gate Verification Checklist

Use the following checklist to evaluate each transfer request:

| Gate | Checkpoint Item | Criteria for Success | Verified (Y/N) |
| :--- | :--- | :--- | :---: |
| **Gate 1** | Target Isolation | Only a single file and isolated frame are targeted. | |
| **Gate 1** | Safety Clearance | Target is not located in a blocked operational path. | |
| **Gate 2** | Design Tokens | Styling overrides strictly utilize CSS custom variables. | |
| **Gate 2** | Code Diff Check | Logic hooks, database calls, and schemas are untouched. | |
| **Gate 3** | Typescript Check | `npx tsc --noEmit` compiles successfully. | |
| **Gate 3** | Visual Evidence | BEFORE/AFTER/Mobile screenshots uploaded and analyzed. | |
| **Gate 3** | Mobile Tap Targets | Interactive target sizes remain >= `44px`. | |
| **Gate 3** | Accessibility | Text-to-background contrast maintains a minimum of `4.5:1`. | |
