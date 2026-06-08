# DSCard Transfer Plan - Welo Platform SaaS

This document outlines the progressive transfer and integration plan for the new reusable stateless `DSCard` primitive component inside the Welo Platform design system.

---

## 🎨 Component Visual Specification

We parsed the visual targets from the read-only Figma mockup frame to define the structural and style props for `DSCard`:

- **Spacing (Paddings):**
  - **none:** `0px`
  - **sm:** `12px` (`var(--space-sm)`)
  - **md (Default):** `16px` (`var(--space-md)`)
  - **lg:** `24px` (`var(--space-lg)`)
- **Border Radius:**
  - Standardized on `rounded-[var(--radius-lg,1rem)]` (16px) for cards to match the visual prototype hierarchy.
- **Border and Contrasy Hierarchy:**
  - Thin border: `border border-[var(--card-border)]`
  - Surface color: `bg-[var(--card-bg)]` (inherits light/dark theme variables).
- **Shadow Depth:**
  - Normal state: `shadow-[var(--shadow-sm)]`
  - Hover state (if hoverable is enabled): `hover:shadow-[var(--shadow-md)]`

---

## 💻 Proposed React Primitive Interface

We will create the component file [DSCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/design-system/components/DSCard.tsx):

```tsx
import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export type DSCardVariant = 'default' | 'flat' | 'outlined';
export type DSCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface DSCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DSCardVariant;
  padding?: DSCardPadding;
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const DSCard: React.FC<DSCardProps> & { metadata: typeof COMPONENT_REGISTRY.DSCard } = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}) => { ... }
```

---

## 🚦 Target Integration Sequence

To ensure regression safety, we will migrate layouts component-by-component in order of risk:

### Step 1: Component Registration
- Register `DSCard` inside [component-registry.ts](file:///c:/Users/Dylan/Documents/welo_platform/src/design-system/registry/component-registry.ts).

### Step 2: Machine History Sections (Phase 1 Target - `CONTROLLED`)
- **Target Path:** [MachineHistorySection.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/MachineHistorySection.tsx).
- **Refactoring:** Swap out the raw card divs (Predictive Analysis card, Reliability Statistics card, and Cost & Operational card) with `<DSCard>` instances.

### Step 3: Service Call Cards (Phase 2 Target - `HIGH_RISK`) [DEFERRED]
- **Target Path:** [ServiceCallCard.tsx](file:///c:/Users/Dylan/Documents/welo_platform/src/modules/service_calls/components/ServiceCallCard.tsx).
- **Refactoring Status:** **DEFERRED TO NEXT PHASE.** Do not modify this file in the current primitive transfer.

---

## 🚫 Blocked Boundaries
The following areas are strictly out-of-scope for the `DSCard` rollout:
- **Dispatcher Kanban view (`/dashboard/dispatch`):** Drag cards are blocked to prevent drag-and-drop offsets.
- **PDF Export sheets:** Blocked from using `DSCard` layout wrappers to prevent printable sheet truncations.
- **Auth screen containers:** Login page cards are blocked.
