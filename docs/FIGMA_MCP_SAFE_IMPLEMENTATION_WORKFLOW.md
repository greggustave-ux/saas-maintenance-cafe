# Figma MCP Safe Implementation Workflow - Welo Platform SaaS

This document establishes the step-by-step developer workflow for querying, planning, implementing, and validating visual layout alignment shifts using the Figma Model Context Protocol (MCP) server.

---

## 🔄 Step-by-Step Alignment Recipe

Every progressive visual alignment session must follow these ten execution steps without skipping any stage:

```
[1. Connect] ➔ [2. Inspect] ➔ [3. Compare] ➔ [4. Propose] ➔ [5. Classify]
                                                               ⬇
[10. Push]   ➔ [9. Commit]  ➔ [8. Verify]  ➔ [7. Patch]    ➔ [6. Approve]
```

### 1. Establish Figma Connection
- Run the local Figma MCP server connection check.
- Ensure the API token has read-only permission limits.

### 2. Inspect Isolated Node Properties
- Locate the target Figma file and query a single designated Node ID.
- Retrieve the node properties, including margin values, background/border color palettes, corner radius attributes, font families, tracking weights, and CSS auto-layout flex directives.

### 3. Compare with Existing Welo Code
- Search the active repository for the corresponding component or page file.
- Contrast the fetched visual node properties against the local Tailwind rules or inline styles.

### 4. Create Code Alignment Proposal
- Create a new implementation plan describing:
  - Exact codebase files to modify.
  - Precise Tailwind classes or variable references to be updated.
  - Styling tokens mapping to global custom properties.
- Guarantee that no react data hooks, authentication, or query parameters are modified.

### 5. Classify Risk Tiers
- Assign the alignment session to its corresponding risk classification:
  - **`SAFE`:** Style tokens, border-radius constants.
  - **`CONTROLLED`:** Stateless components (badges, buttons, cards).
  - **`HIGH_RISK`:** Mobile technician views and list details.
  - **`BLOCKED`:** Kanban dispatchers, PDF render sheets, signature validations, auth databases.

### 6. Wait for Human Approval
- Stop execution and request explicit user review of the alignment proposal.
- **Do not modify any source code files until the user explicitly responds with approval.**

### 7. Apply Minimum Code Patch
- Apply changes strictly targeting the visual attributes approved in the proposal.
- Maintain stateless code execution. Do not inject business rules or API methods into visual elements.

### 8. Run Verification & Compilation Audits
- Run TypeScript checks to verify code compiles cleanly:
  ```powershell
  npx tsc --noEmit
  ```
- Run the linter to confirm code quality:
  ```powershell
  npm run lint
  ```
- Compile a production Next.js build locally:
  ```powershell
  npm run build
  ```

### 9. Verify Mobile Views & Design Contrast (Visual Parity Evidence)
- Audit modified components at viewport widths down to `320px`.
- Ensure all interactive elements preserve tap zones of at least `44px`.
- Ensure text-to-background contrast maintains a minimum of `4.5:1` in both light and dark modes.
- Take BEFORE and AFTER screenshots along with mobile layout notes to document structural integrity.

### 10. Commit & Push Isolated Changes
- Run `git status` to verify only the approved visual component files are modified.
- Commit styling improvements to the isolation branch (`feature/dsbadge-primitive`) and push.
