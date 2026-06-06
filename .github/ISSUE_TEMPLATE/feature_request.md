---
name: "🚀 Feature Request"
about: Propose a new feature or capability for the Welo Platform
title: "feat: [Short Description]"
labels: ["feature"]
assignees: ""
---

## 🎯 Goal & Business Context
Provide a clear description of the problem this feature solves and why it is important to our users/customers.

## 💡 Proposed Solution
Describe the requested behavior, user flow, or UI changes. Link to any Figma designs or wireframes if available:
- **Figma Design Link:** [Insert Link]

## ⚡ Operational Impact Checkpoints
How will this feature impact existing workflows? (Describe updates or concerns for each)
- **Dispatch Workflow:** (e.g. scheduling adjustments, dispatch board updates)
- **Technician Mobile Workflow:** (e.g. mobile-first layouts, job actions)
- **Inventory/Stock Workflow:** (e.g. part tracking, consumption)
- **Offline / Sync Caching:** (e.g. handling disconnected operations, sync priorities)
- **Analytics & SLA Logs:** (e.g. dashboard statistics, metric collections)

## 🎨 UI/UX Design System Compliance
- **Typography:** Uses Inter typography system (`docs/DESIGN_SYSTEM_RULES.md`)
- **Tokens Mapping:** Confirms custom colors use HSL tokens from `globals.css`
- **Responsive Layout:** Must follow the mobile-first css guidelines
- **Mobile Usability:** Requires interactive elements >= 44x44px touch targets

## ♿ Accessibility (a11y) Design
- **Keyboard Access:** Tab navigation paths planned? [Yes / No]
- **Focus Rings:** Visible focus outline style specified? [Yes / No]
- **Screen Reader Support:** Semantic HTML and `aria-` labels mapped out? [Yes / No]

## 🛡️ Security & Access Control
- Does this feature introduce new database tables? [Yes / No]
- **Supabase RLS Policy Mapping:** List the precise CRUD security rules:
  - **Select:**
  - **Insert:**
  - **Update:**
  - **Delete:**
- **User Roles:** Who can access this data? (e.g. Dispatcher, Technician, Admin)
