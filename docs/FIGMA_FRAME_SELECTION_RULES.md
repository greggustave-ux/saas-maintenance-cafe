# Figma Frame Selection Rules - Welo Platform SaaS

This document establishes the Frame Selection Rules when querying Figma visual layouts via the Model Context Protocol (MCP). It defines the strict scoping, targeting constraints, and node mapping standards to ensure safe, localized UI updates.

---

## 🚫 Frame Scope Isolation Rules

To prevent code reflow issues, every Figma query session must isolate target frames using these constraints:

### 1. Single Node Target Rule
- **Rule:** Antigravity is restricted to querying exactly one Figma Node ID per session (e.g. `123:456`).
- **Reason:** Querying large multi-frame canvas groups leads to broad, uncontrolled layout shifts and increases compilation regression risks.

### 2. Primitive Component Boundaries
- **Rule:** Target nodes must represent leaf-level layout objects or small structural primitives:
  - **Allowed Targets:** Badges (`DSBadge`), cards (`DSCard`), buttons (`DSButton`), simple text labels, search field containers, and static list rows.
  - **Blocked Targets:** Full dashboard pages (`/dashboard`), drag-and-drop dispatcher boards, dynamic data charts, PDF structures, signature drawing boxes, and nested modals.

### 3. Nested Operational Logic Verification
- **Rule:** Before parsing a Figma component, the node structure must be inspected to ensure it does not wrap interactive systems.
- **Action:** If the target frame contains interactive drawing inputs, file uploader nodes, or data mutations, the session must be terminated immediately.

---

## 🎨 Figma-to-Code Styling Taxonomy

When translating Figma vector nodes to Next.js CSS styles, map layer attributes using this strict taxonomy:

| Figma Node Layer Type | Target Visual Property | Code Implementation Rule |
| :--- | :--- | :--- |
| **`RECTANGLE` / `FRAME`** | Corner Rounding | Map to `--radius-sm`, `--radius-md`, or `--radius-lg` variables in [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css). Do not use hardcoded pixel sizes. |
| **`RECTANGLE` / `FRAME`** | Background Color | Map to Tailwind HSL semantic classes (e.g., `bg-neutral-50` or `bg-status-active-bg`). |
| **`TEXT`** | Font Sizing | Map to standard text sizing variables (e.g. `text-xs`, `text-sm`, `text-md`). |
| **`TEXT`** | Font Weight & Spacing | Map to standard CSS classes (e.g. `font-medium`, `tracking-tight`, `leading-normal`). |
| **`VECTOR` / `INSTANCE`** | SVG Icons | Do not generate vector paths. Reference existing Lucide React icon components. |
| **`AUTO_LAYOUT`** | Flex Containers | Map padding, horizontal gap, and align properties directly to Tailwind flex utilities (e.g., `flex`, `items-center`, `gap-2`). |

---

## 🚦 Target Verification Rules

Before executing an alignment patch based on a Figma node, verify:
- **Node Status:** Is the node marked as "Ready for Dev" in Figma? If not, verify styling intent with the user.
- **Dynamic Content Check:** Does the text layer contain placeholder text? Ensure the React implementation uses dynamic variables rather than hardcoded string labels.
- **Contrast Check:** Verify that the foreground text fill color and background container fill color meet the `4.5:1` WCAG AA contrast threshold inside the local theme.
