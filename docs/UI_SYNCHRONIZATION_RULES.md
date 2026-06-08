# UI Synchronization Rules & Integration Roadmap - Welo Platform SaaS

This document establishes the boundaries, verification pipelines, and progressive roadmap for syncing Figma designs and Next.js React components via the Model Context Protocol (MCP).

---

## 🔒 Synchronization Boundaries & Safety Gates

To prevent visual regressions, layout breakage, and operational workflow failures, UI modifications must observe the following constraints:

### 1. No Direct Write to Production UI
- The Figma MCP server must not push updates directly to production branches (`main` or `production`).
- The AI agent must implement component updates in dedicated feature branches (e.g. `feature/ui-sync-card`).

### 2. Reviewable Diffs & Preview Checks
- Every UI sync operation must generate clear, atomic diffs.
- The pull request must include screenshots or video recordings showing side-by-side checks on mobile and desktop viewports.

### 3. Human Approval Requirement
- An engineer must verify that the generated components use styling variables from `globals.css` instead of custom hardcoded styles.
- A product manager or designer must approve the PR visual behavior before merging into `staging`.

---

## 🎨 Future Scaling & White-Label Readiness

### 1. Shared Tokens Schema
To maintain a single source of truth:
- We will define a standardized JSON token schema (`welo-tokens.json`) shared between Figma variables API and the Next.js build pipeline.
- Modifying design tokens in Figma will regenerate the JSON, which automatically updates the Tailwind configuration theme maps on build.

### 2. Component Registry Strategy
- All reusable layout cards and badges will be listed in a component registry (`docs/COMPONENT_REGISTRY.md`).
- Before creating a new component, the AI agent must check the registry to prevent duplicate implementations.

### 3. Future AI-Assisted Generation
- Future iterations will authorize AI subagents to read component registry specs and generate layout variations on-the-fly for review.
- All AI-generated components must compile cleanly under strict TypeScript configurations (`tsc --noEmit`).

### 4. White-Label Support
- Design tokens must remain fully customizable per client (e.g., custom colors, logo variables, and font mapping).
- Client branding overrides will be injected dynamically at the root layout wrapper using scoped CSS variables:
  ```css
  .client-branding-subdomain {
    --primary: var(--client-primary-color);
    --radius-lg: var(--client-radius-choice);
  }
  ```

---

## 📅 Phased MCP UI Integration Roadmap

To minimize technical debt, Welo Platform will adopt a 4-phase integration roadmap:

```
[Phase 1: Token Sync] ➔ [Phase 2: Registry & Audit] ➔ [Phase 3: Component Drafting] ➔ [Phase 4: Auto Validation]
```

### Phase 1: Design Tokens Synchronization (Immediate)
- **Objective:** Export Figma variables to `variables.css` and use them in React.
- **Verification:** Local compiler checking for hex-code errors.

### Phase 2: Component Registry & Audit (Next Sprint)
- **Objective:** Inventory all existing frontend components and cross-reference them with Figma Dev Mode frames.
- **Verification:** Manual audit by engineering and design teams.

### Phase 3: Component Generation Drafting (Mid-term)
- **Objective:** Authorize the AI agent to draft new components inside the `src/modules/` sandbox directory.
- **Verification:** Automated linting, build checks, and human code reviews.

### Phase 4: Automated CI/CD Design Validation (Long-term)
- **Objective:** Integrate automated visual regression testing (e.g. Playwright screenshots matched against Figma image exports).
- **Verification:** Full CI check passes before staging merges.
