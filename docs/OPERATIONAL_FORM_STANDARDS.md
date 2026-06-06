# Operational Form Standards - Welo Platform SaaS

This document establishes the UX/UI and accessibility standards for all operational form elements on the Welo Platform. It defines the layout spacing, field heights, focus states, validation styling, and responsive behaviors for all input elements.

---

## 🎨 Styling Tokens & Form Variable Mapping

All form elements are constructed using core design tokens to ensure visual harmony across light and dark modes:

| Attribute | Token Variable | Value / Description |
| :--- | :--- | :--- |
| **Field Height (Input/Select)** | `var(--touch-target-min)` | Minimum height of **44px** for tactile precision |
| **Field Padding** | Horizontal: `1rem` (16px), Vertical: `0.75rem` (12px) | Compact but highly readable text padding |
| **Border Radius** | `var(--radius-md)` | **8px** matching operational cards |
| **Border Color (Default)**| `var(--card-border)` | Semi-transparent slate, adapts to dark mode theme |
| **Border Color (Error)**  | `rgb(239, 68, 68)` | Crimson border, high contrast alert color |
| **Background (Field)**   | `var(--card-bg)` | Solid container background, matches theme background |
| **Focus Highlight Ring**  | `var(--primary)` | **Cyan/Sky Blue** glow (3px offset, `0.15` opacity shadow) |
| **Typography (Label)**    | `var(--font-size-sm)` | **12px** uppercase, bold, mono tracking-wider |
| **Typography (Input)**    | `var(--font-size-base)`| **14px** standard body text sizing (Inter font-sans) |

---

## 📱 Mobile-First Guidelines & Tactile Interaction

To support field technicians operating on mobile devices under high-contrast or rugged conditions, form interactions follow these strict specifications:

1. **Tactile Targets:**
   - Any clickable input field, select option trigger, or button must occupy a bounding height of at least **44px** (`var(--touch-target-min)`).
   - Horizontal gaps between inputs in inline layouts must be at least **8px** (`var(--touch-spacing-min)`).

2. **One-Thumb Usability:**
   - Place related fields in logical single-column vertical flows on screen sizes under `640px` (standard mobile portrait width).
   - Place action buttons (e.g. "Annuler" / "Créer") as full-width blocks on narrow viewports to avoid mistaps.

3. **Autofill & Keyboard Types:**
   - Use standard HTML validation input types (`type="tel"`, `type="email"`, `type="number"`) to trigger the appropriate system keyboard on iOS/Android.
   - Set `autoComplete="off"` or appropriate defaults for sensitive reference keys.

---

## ♿ Accessibility (a11y) & Keyboard Flow

All form layouts must remain completely accessible via assistive technologies:

- **Accessible Labels:** Every form control must have a corresponding, readable `<label>` using the `htmlFor` property linking to the input’s unique `id`.
- **Keyboard Tab Ordering:** Focus order must follow the natural visual reading sequence (top-to-bottom, left-to-right).
- **Aria Attributes:**
  - Validation errors must announce themselves via `aria-describedby` linking to the error text element.
  - Required fields must specify `aria-required="true"`.
- **Contrast Ratios:** Background-to-foreground text ratios for disabled state fields must maintain at least a **3.0:1** contrast level, while active fields must maintain **4.5:1** (WCAG AA).

---

## 📦 Foundational Components Reference

Operational form standard elements are managed in `/src/design-system/components/forms/`:

### 1. `DSLabel`
- Standard label rendering utilizing uppercase Inter typography.
- Automatically appends a red asterisk (`*`) when `required` is true, keeping it accessible via `aria-hidden="true"`.

### 2. `DSInput`
- Standard text, email, telephone, and password container.
- Integrates local loaders (SVG spinner on the right side) and error highlights.

### 3. `DSTextarea`
- Textarea wrapper with native vertical resizing enabled (`resize-y`).
- Minimum height defaults to **100px** to handle long problem descriptions.

### 4. `DSSelect`
- Custom options selection element.
- Enforces system theme overrides (`[color-scheme: light dark]`) to prevent browser style inconsistencies.

### 5. `DSFormSection`
- Container grid wrapper utilizing card background, borders, and shadows to group related fields logically.

### 6. `DSValidationMessage`
- Standard indicator message block for validation messages. Adapts color classes for positive info or error highlights.

---

## 📝 Migrated Forms Log

- **ServiceCallCreateEditForm (v1.0.0):** Migrated as first operational form candidate. The legacy `NewServiceCallForm` inputs, selects, labels, and textareas have been successfully replaced with design-system form components (`DSInput`, `DSSelect`, `DSLabel`, `DSTextarea`, `DSFormSection`). Enforced 44px minimum target heights and verified responsive mobile behavior. No Supabase or route behaviors were modified.
