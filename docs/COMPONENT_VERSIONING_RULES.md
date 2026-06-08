# Component Versioning & Lifecycle Rules - Welo Platform SaaS

This document establishes the guidelines, versioning system, and lifecycle stages for all components in the Welo Platform UI library.

---

## 📅 Component Lifecycle States

Every component in the Welo Platform registry must exist in one of these five states:

```
[Draft] ➔ [Experimental] ➔ [Validated] ➔ [Production-Approved] ➔ [Deprecated]
```

### 1. Draft
- **Description:** Component is under active development on a local sandbox or draft branch.
- **Rules:** Banned from staging and production. May contain mock props and inline styles.

### 2. Experimental
- **Description:** Added to development branches and deployed to preview environments for testing.
- **Rules:** Awaiting accessibility check and design token validation. May change without notice.

### 3. Validated
- **Description:** Tested for mobile-first responsiveness, WCAG AA compliance, and local performance.
- **Rules:** Approved to merge to the `staging` branch.

### 4. Production-Approved
- **Description:** Deployed to `app.welo.app` and active in customer workflows.
- **Rules:** Cannot be deleted or modified in a way that introduces breaking changes without semver increments.

### 5. Deprecated
- **Description:** Marked for removal in future sprints.
- **Rules:** Do not use for new features. Must remain in codebase until all reference paths are refactored.

---

## 🔢 Semantic UI Versioning Strategy

Components adopt a modified Semantic Versioning (`semver`) schema: `Major.Minor.Patch`.

### 1. Patch Releases (`0.0.x`)
- **Criteria:** Internal bug fixes, visual tweaks, or token color syncs that do not alter props or markup structure.
- **Example:** Changing a hover state background color variable.

### 2. Minor Releases (`0.x.0`)
- **Criteria:** Adding new optional properties, new optional action buttons, or visual styling additions that remain backward-compatible.
- **Example:** Adding an optional `avatarUrl` prop to `TechnicianBadge`.

### 3. Major Releases (`x.0.0`)
- **Criteria:** Breaking interface modifications. Dropping mandatory properties, renaming components, or refactoring layouts in a way that requires update of parent components.
- **Example:** Deleting the `id` prop and replacing it with a mandatory `ticketObject` prop on `ServiceCallCard`.

---

## 🔄 Breaking Change & Rollback Compatibility Rules

To prevent client crashes:
- **No Direct Props Removal:** When deprecating a prop, make it optional and support a fallback behavior for at least one major release.
- **Staged Transitions:** Deploy new minor versions of components to the repository first, refactor reference paths, and then deprecate/delete older versions.
- **Mobile Cache Safety:** Since mobile devices cache frontend assets aggressively, ensure components can handle legacy cache states gracefully.
- **Figma Version Tracking:** Each production-approved component must include a Figma frame version reference in its registry metadata (e.g. `figma-node-version: v2.1`).
