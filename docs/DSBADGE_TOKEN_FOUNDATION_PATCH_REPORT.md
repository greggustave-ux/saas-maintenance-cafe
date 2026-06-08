# DSBadge Token Foundation Patch Report - Welo Platform SaaS

This document establishes the DSBadge Token Foundation Patch Report for Welo Platform. It details the added CSS custom variables, theme mapping variables, and dark-mode compliance patterns implemented to stabilize the `DSBadge` styling system.

---

## 🎨 Centralized Token Foundations

We added the following token foundations inside [globals.css](file:///c:/Users/Dylan/Documents/welo_platform/app/globals.css) to support standard badge styling:

### 1. Border Radius Token
- **Variable:** `--radius-sm: 4px;`
- **Location:** Defined under `:root` and `@theme inline` to provide a centralized fallback.
- **Consumption:** Resolves dynamically in `DSBadge.tsx` to standardize badge pill corners to `4px`.

### 2. Centralized HSL Status Mappings
We declared status tokens in standard HSL/HSLA channels to guarantee exact visual parity with previous color properties:

| Status Variant | Color Scope | Light Mode Value (HSL/HSLA) | Dark Mode Value (HSL/HSLA) |
| :--- | :--- | :--- | :--- |
| **new** | background | `hsla(204, 100%, 97%, 0.7)` | `hsla(205, 100%, 7%, 0.2)` |
| | border | `hsl(202, 93%, 88%)` | `hsla(205, 83%, 21%, 0.3)` |
| | text | `hsl(201, 96%, 32%)` | `hsl(203, 89%, 53%)` |
| **assigned** | background | `hsla(226, 100%, 97%, 0.7)` | `hsla(244, 47%, 12%, 0.2)` |
| | border | `hsl(232, 92%, 84%)` | `hsla(244, 55%, 41%, 0.3)` |
| | text | `hsl(243, 75%, 59%)` | `hsl(239, 84%, 67%)` |
| **on_the_way** | background | `hsla(48, 100%, 96%, 0.7)` | `hsla(26, 83%, 13%, 0.2)` |
| | border | `hsl(48, 96%, 89%)` | `hsla(28, 73%, 26%, 0.3)` |
| | text | `hsl(35, 92%, 33%)` | `hsl(43, 96%, 56%)` |
| **on_site** | background | `hsla(214, 100%, 97%, 0.7)` | `hsla(222, 47%, 12%, 0.2)` |
| | border | `hsl(214, 95%, 84%)` | `hsla(222, 47%, 31%, 0.3)` |
| | text | `hsl(217, 91%, 60%)` | `hsl(219, 96%, 67%)` |
| **waiting_parts**| background | `hsla(270, 100%, 98%, 0.7)` | `hsla(276, 72%, 16%, 0.2)` |
| | border | `hsl(272, 88%, 85%)` | `hsla(273, 67%, 39%, 0.3)` |
| | text | `hsl(271, 81%, 56%)` | `hsl(271, 91%, 71%)` |
| **completed** | background | `hsla(143, 85%, 96%, 0.7)` | `hsla(164, 86%, 16%, 0.2)` |
| | border | `hsl(141, 79%, 85%)` | `hsla(162, 72%, 24%, 0.3)` |
| | text | `hsl(161, 94%, 30%)` | `hsl(150, 84%, 53%)` |
| **closed** | background | `hsl(210, 40%, 96%)` | `hsl(215, 28%, 17%)` |
| | border | `hsl(213, 27%, 84%)` | `hsl(215, 25%, 27%)` |
| | text | `hsl(215, 25%, 27%)` | `hsl(213, 27%, 84%)` |
| **cancelled** | background | `hsla(0, 100%, 97%, 0.7)` | `hsla(0, 75%, 15%, 0.2)` |
| | border | `hsl(0, 93%, 89%)` | `hsla(0, 63%, 31%, 0.3)` |
| | text | `hsl(0, 74%, 42%)` | `hsl(0, 84%, 60%)` |

---

## 🛠️ Tailwind v4 theme mappings

To ensure clean consumption without hardcoded inline spans inside components, we mapped the variables inside `@theme inline` of the global style sheet:
```css
@theme inline {
  --radius-sm: var(--radius-sm);

  /* DSBadge Color Tokens */
  --color-status-new-bg: var(--status-new-bg);
  --color-status-new-border: var(--status-new-border);
  --color-status-new-text: var(--status-new-text);
  ...
}
```
This maps the variables dynamically, allowing the React component to consume them as `bg-status-new-bg`, `border-status-new-border`, and `text-status-new-text`.

---

## 🌓 Dark Mode Stabilization

To satisfy dark mode constraints, we did not modify global background templates, primary accent themes, or other page components.
We declared dark-mode specific status color properties inside the prefers-color-scheme media query block. These resolve dynamically when the system theme shifts, ensuring zero contrast regressions and full compliance on dark themes.
