# Operational UI Patterns & Safety - Welo Platform SaaS

This document establishes the patterns, constraints, and safety guidelines for the operational interfaces of Welo Platform. It governs how we design and deploy interfaces to protect field technician productivity and prevent operational disruption.

---

## 🛡️ Operational UI Safety Guidelines

Welo Platform's interface directly coordinates physical dispatching and field operations. A design error or broken button can result in missed appointments, delayed repairs, or lost telemetry.

### 1. Protect Technician Workflows
- **Non-blocking UI:** Avoid full-screen blocking modals during active jobs unless critical (e.g. safety warning or signature capture).
- **Session Preservation:** Forms and job logs must save intermediate inputs to local cache (e.g. IndexedDB) on every keystroke. A sudden app crash or browser refresh must not lose data.
- **Accidental Click Prevention:** Double-trigger safety rules apply to destructive or irreversible actions. Buttons like "Delete Upload" or "Cancel Job" must require a double-tap or a sliding confirmations gesture.

### 2. Prevent Accidental Workflow Redesign
- **Structural Integrity:** The layout structure and column mappings of the Dispatch Kanban and Technician checklist flows are locked.
- **Review Pipeline:** Changes altering user flow hierarchies or transition states (e.g. adding forced steps before a technician can complete a job) require product review and user acceptance testing.

### 3. Preserve Low Cognitive Load
- **Field Visiblity:** Screen designs must maintain high readability under extreme sun glare or poor lighting. Use bold text weights and high-contrast status colors.
- **Minimal Form Fields:** Limit typing requirements on mobile viewports. Prefer selectors, pre-filled checklists, and tap buttons over text fields.

### 4. Preserve Field Efficiency
- **Thumb-Zone Placement:** Place main actions (e.g. "Arrive", "Start Work", "Complete Work") at the bottom of the viewport.
- **Fast Actions:** Primary interactions must respond within 100ms. Disable transition animations if they introduce perceptible interaction latency on low-end mobile hardware.

### 5. Preserve Offline Usability
- **Optimistic State Updates:** UI elements must instantly change to their target states (e.g. marking a task checkbox complete) before the network request is initiated.
- **Disconnected Caching:** Cache status indicator pills (e.g. `OfflineSyncIndicator`) must be visible, assuring technicians their offline entries are safely cached.

---

## 🎨 Design-to-Code Audit Checklist

When reviewing any UI modifications, the reviewer must check:
- [ ] Are all touch targets >= 44x44px?
- [ ] Does the page compile mobile-first?
- [ ] Is typography restricted to Inter variables?
- [ ] Are form inputs saved to local state immediately?
- [ ] Does the change maintain contrast safety (WCAG AA)?
