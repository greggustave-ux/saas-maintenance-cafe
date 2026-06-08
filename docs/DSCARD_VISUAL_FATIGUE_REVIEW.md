# DSCard Visual Fatigue Review - Welo Platform SaaS

This document establishes the UI guidelines to prevent visual fatigue and cognitive clutter in Welo Platform. It defines rules for shadow accumulation, card stacking, and nested card borders.

---

## 👁️ Visual Fatigue & Shadow Stacking Analysis

Visual fatigue occurs when a screen contains too many elevated containers, sharp borders, or conflicting layout panels. Stacking cards with heavy drop shadows can create an unstable UI.

### 1. Shadow Accumulation Risks
- **Problem:** Stacking multiple cards with shadows (e.g. `shadow-md`) in a vertical timeline or grid results in visual noise.
- **Rule:** 
  - Standard cards must use `shadow-[var(--shadow-sm)]` (extremely subtle shadow).
  - Stacking cards inside scroll lists (such as the timeline or search results) must use the `flat` variant (zero shadow) or `outlined` variant (zero shadow, thin border) to prevent drop-shadow stacking.
  - Elevating shadows via `hoverable` animations is only allowed on sparse dashboard indexes, not on high-density list items.

### 2. Nested Card Styling Rules
- **Problem:** Nesting an outlined card inside another outlined card creates double-border borders that clutter metadata.
- **Rule:**
  - If a card is nested inside a parent container, the child card must use the `flat` variant with a background tint (e.g. `bg-slate-50/20` or dark mode counterpart) rather than rendering an outlined border.
  - Muted borders (`border-slate-200/50` or `border-[var(--card-border)]` at reduced opacities) must be used for inner segments.

---

## 🎨 Flat vs Outlined Variant Selection Guide

To maintain a clean visual hierarchy, map `DSCard` variants using this registry:

| Card Context | Recommended Variant | Shadow Level | Styling Rationale |
| :--- | :--- | :--- | :--- |
| **Dashboard Stats Cards** | `default` | `shadow-sm` | Separates key metrics from page backgrounds. |
| **Search List Items** | `outlined` | None | Keeps list rows distinct without causing drop-shadow clutter. |
| **Nested Timeline Events** | `flat` | None | Highlights history cards using background tints without nested borders. |
| **AI Suggestion Banners** | `flat` | None | Uses colored backgrounds to indicate warnings or alerts. |
| **Detail Page Sidebars** | `outlined` | None | Groups read-only meta fields cleanly. |
