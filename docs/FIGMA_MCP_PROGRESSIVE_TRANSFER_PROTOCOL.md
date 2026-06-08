# Figma MCP Progressive Transfer Protocol - Welo Platform SaaS

This document establishes the Figma Model Context Protocol (MCP) Progressive Transfer Protocol for Welo Platform. It defines the rules, scopes, and governance boundaries to use Figma as a read-only visual reference layer for progressive layout alignment.

---

## 📡 Core Principles & Reference Model

To prevent layout reflow regressions or codebase corruption, the integration follows a strict hybrid alignment model:

1. **Welo Codebase is the Functional Source of Truth:**
   - All business logic, event handlers, lifecycle hooks, state management, and database connections inside the Welo React/Next.js files are protected. 
   - Figma designs represent visual targets, not a production runtime engine.
2. **Figma is the Visual/UX Source of Reference:**
   - Visual attributes (colors, typography weight/spacing, rounded corners, padding rules, and grid proportions) are queried from Figma to improve user experience.
3. **No Automatic Synchronization:**
   - Automatic code generation, background layout synchronizers, or direct Figma-to-React compilers are strictly blocked.
4. **Mandatory Compare, Propose, and Approve Cycle:**
   - Antigravity must query visual details, compare them with the active codebase, write an alignment plan, and receive explicit user approval before modifying any styles.

---

## ⚙️ Initial MCP Mode Configuration

The Figma MCP server must operate under a locked, read-only session scope:

- **Read-Only Permissions:** No write permissions to Figma. Antigravity cannot modify mockups, adjust Figma nodes, rename styles, or publish component updates back to Figma.
- **Strict Scope Isolation:** Only a single Figma file ID and a single selected frame, node, or component can be queried per workspace session.
- **No Direct Compilation:** Figma vector graphics or layout nodes cannot be transformed directly into React JSX trees. The code structures must be drafted manually to match Welo coding patterns.

---

## 🚦 Visual Parity Evidence & Tolerance Rules

### 1. Visual Parity Evidence Rule
Every progressive UI alignment session must document evidence of structural integrity. The implementation pull request (PR) or validation report must include:
- **BEFORE Screenshot:** A visual capture of the active production layout before modifications.
- **AFTER Screenshot:** A visual capture of the modified local layout showing token compliance.
- **Mobile Verification Screenshot:** A capture of the viewport at `320px` to `480px` demonstrating zero layout clipping or text overlap.
- **Density & Layout Comparison Notes:** A bulleted text summary detailing changes in vertical height, grid flex wrapping, and responsive reflow behavior.

### 2. Visual Parity Tolerance Rule
Perfect pixel-by-pixel matching is **not** required. Deviation from the Figma layout is permitted and encouraged if:
- **Operational Usability Improves:** Button sizes, form labels, or text inputs become clearer and easier to interact with.
- **Mobile Stability Improves:** Margins are wider or wraps occur earlier, preventing overlaps on smaller viewports.
- **Layout Density is Preserved:** Sizing changes do not push transactional controls (like save buttons or canvas pads) below the scroll fold.
- **Responsive Behavior Remains Stable:** The layout gracefully scales across viewports (`320px`, `768px`, `1024px`, `1440px`).
- **Accessibility remains compliant:** Color contrast matches WCAG AA (at least `4.5:1` for text elements), and touch targets maintain a minimum size of `44px`.

---

## 📱 Runtime Reality Protection Rules

Static designs do not capture real-world operational environments. All transfers must protect runtime performance by factoring in:

- **Dynamic Data Density:** User names, machine serial numbers, and descriptions can be extremely long. Labels and components must support ellipses or line wraps without clipping adjacent columns.
- **Mobile Viewport Variability:** Handheld devices range in aspect ratio and size. Ensure that headers, margins, and lists utilize relative percentages (`%`) or viewport width units (`vw`) instead of hardcoded pixel sizes (`px`).
- **Safe-Area Behavior:** Bottom navigation blocks or modal popups must respect device physical safe zones (e.g. notch styling variables) to prevent overlaps on mobile technicians' phones.
- **Overflow Risks:** Contain text blocks with proper flex boundaries (`min-w-0`, `truncate`, or `break-words`) to prevent raw data strings from stretching parents.
- **Runtime Text Expansion:** Ensure localized languages or long titles do not break card heights.
- **Loading & Error States:** Ensure components have visual skeletons and warning borders that comply with the design tokens.
- **Offline & Degraded Network States:** Maintain high readability for connectivity indicators. No layout alignment should mask or hide background sync triggers.
