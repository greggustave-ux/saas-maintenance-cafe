# Technical Design System Implementation - Welo Platform SaaS

This document outlines the technical architecture, directory structure, token bindings, and phased migration roadmap for the Welo Platform Design System.

---

## 📂 Directory Structure

The design system is located under `/src/design-system/` to separate visual elements and core layouts from business modules:

```
src/design-system/
├── tokens/               # Design token TS definitions
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   ├── radius.ts
│   ├── shadows.ts
│   ├── animations.ts
│   ├── zIndex.ts
│   └── touchTargets.ts
├── registry/             # MCP-readable component registry
│   ├── component-types.ts
│   ├── component-status.ts
│   ├── sync-risk-levels.ts
│   └── component-registry.ts
├── components/           # Base operational components
│   ├── StatusBadge.tsx
│   ├── PriorityBadge.tsx
│   ├── OfflineSyncIndicator.tsx
│   └── MobileBottomNavigation.tsx
├── offline/              # Offline queue interfaces & sync logic
│   └── sync-state.ts
├── mobile/               # Mobile layouts (placeholders)
└── patterns/             # Layout pattern configurations (placeholders)
```

---

## 📐 Token Bindings & CSS Custom Properties

Tokens export CSS variable bindings to ensure synchronization compatibility with Figma variables.

Example:
```typescript
import { colors } from '../tokens/colors';
// colors.primary resolves to "var(--primary)"
```

This mapping guarantees that if design variables inside `globals.css` are updated, all TypeScript components receive the changes instantly without manual re-compilations.

---

## 🤖 Component Registry Metadata

To enable safe AI-assisted edits, every component defines a static metadata object linking it to the registry:

```typescript
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export const StatusBadge = () => { ... };
StatusBadge.metadata = COMPONENT_REGISTRY.StatusBadge;
```

This structural linking allows local lint rules and MCP scripts to parse:
- **`syncRiskLevel`**: Block edits if risk is marked `high`.
- **`figmaNodeMapping`**: Match Figma frame node coordinates directly to the codebase.
- **`lifecycleStage`**: Verify validation stage before deployment.

---

## 🔄 Staging & Migration Roadmap

To transition the codebase from legacy components to design-system-driven components safely, Welo Platform will adopt a 3-step migration plan:

### Phase 1: Foundation Rollout (Current Sprint)
- Deploy `/src/design-system/` directory with base components.
- Run typecheck tests to verify zero compile warnings.

### Phase 2: Dual Integration (Parallel Run)
- Integrate design system badges (`StatusBadge`, `PriorityBadge`) in non-critical views (e.g. settings or secondary details lists).
- Retain existing templates for critical dispatch and check-in workflows.
- Monitor console performance and tap responsiveness.

### Phase 3: Complete Deprecation & Replacement
- Gradually replace legacy cards (e.g., `ServiceCallCard`) with new design-system-conforming variations.
- Run complete visual regression audits on mobile viewports.
- Remove old CSS styles and mark legacy assets as `deprecated` inside versioning registries.
