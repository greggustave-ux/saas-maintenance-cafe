# Figma Node Mapping Strategy - Welo Platform SaaS

This document establishes the mappings and structural translation patterns between Figma design nodes and Welo Platform's React frontend files. It serves as a static translation model for read-only design audits.

---

## 🗂️ Node Mapping Categories

Figma design elements are categorized and translated into the code repository using five mapping layers:

### 1. Figma Node ID ➔ Component Registry
- **Figma Node ID:** Unique identifier for frames/components in Figma (e.g. `node-id=201:10`).
- **Target Map:** Mapped directly to the React component definition's metadata blocks (e.g., `ServiceCallCard.metadata.figmaNodeMapping`).
- **Registry Alignment:** Validated against the `figmaNodeMapping` property in `docs/COMPONENT_REGISTRY.md`.

### 2. Figma Variables ➔ Design System Tokens
- **Figma Variable Collections:** Name-spaced tokens grouped under colors, typography, border-radii, spacing, and shadows.
- **Translation Schema:**
  - `colors/primary` ➔ `--primary` / `colors.primary`
  - `spacing/space-md` ➔ `--space-md` / `spacing.md`
  - `radius/radius-lg` ➔ `--radius-lg` / `radius.lg`
- **Validation Rule:** All values are parsed to matching CSS custom properties inside `globals.css` and TypeScript token wrappers.

### 3. Figma Components ➔ React Functional Components
- **Figma Masters:** Verified variant components (e.g. `StatusBadge` variants like `new`, `assigned`, `completed`).
- **React Translation:** Maps directly to typed functional components (`StatusBadge.tsx`) consuming the corresponding variant props (`status="completed"`).
- **Registry Compliance:** Every master component must declare a root-level `data-welo-component` DOM attribute mapping to its component name.

### 4. Figma Frames ➔ Application Routes & Screens
- **Figma Screen Layouts:** Grouped screen frames representing full viewport boundaries (e.g., Operations Dashboard desktop screen, Technician mobile list).
- **React Translation:** Maps to Next.js route page entries:
  - Frame `Operations Dashboard` ➔ `app/dashboard/operations/page.tsx`
  - Frame `Mobile Service Calls List` ➔ `app/dashboard/service-calls/page.tsx`

### 5. Figma Annotations ➔ Compliance Audit Tags
- **Dev-Mode Documentation:** In-canvas dev annotations, code blocks, or custom tags.
- **React Translation:** Maps to registry `auditTags` arrays (e.g. `auditTags: ['Mobile/List', 'TouchTarget44']`).
- **Validation Rule:** Used to verify a11y specifications (e.g. contrast, keyboard safe indicators) directly in audit summary reports.

---

## 🔄 Version Tracking Strategy

To ensure styling changes are tracked and synchronized correctly, mappings utilize a three-stage versioning control:

1. **Figma File Version ID:** Every discovery scan logs the latest Figma commit/save version ID (e.g. `figma_version_v124_approved`).
2. **React Component Version:** React component metadata registers the supported version (e.g., `version: '1.0.0'`).
3. **Change Detection:** If a Figma master component's version ID changes, the discovery layer highlights the component as `review-required`, alerting developers to inspect code templates for visual regression safety.
