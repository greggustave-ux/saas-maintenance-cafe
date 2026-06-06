# GitHub Operations Strategy - Welo Platform SaaS

This document establishes the GitHub coordination strategy for the Welo Platform repository. It defines our Issue labels, Milestone lifecycle, and Projects v2 boards to ensure maximum operational coordination, safety, and velocity.

---

## 🏷️ GitHub Labels Strategy

Welo Platform uses a curated HSL-tailored color palette for labels. This maintains a clean and professional appearance on boards and prevents visually cluttering developers and AI subagents.

### Work Categories (Prefix: None)
These labels categorize the functional or component layer of the work.

| Label Name | Color (HEX) | Description |
| :--- | :--- | :--- |
| `feature` | `#22d3ee` | Developer execution of new product capabilities |
| `bug` | `#f43f5e` | Functional issue or regression in the codebase |
| `ui` | `#6366f1` | Interface polishes, layouts, CSS modifications, visual fixes |
| `mobile` | `#10b981` | Smartphone viewport optimizations, offline features, mobile touch fixes |
| `database` | `#f59e0b` | Supabase migrations, RLS adjustments, seed adjustments, and backend RPCs |
| `ai` | `#8b5cf6` | Scripts, prompts, local tools, and agent workflows |
| `infrastructure`| `#64748b` | Build systems, npm package modifications, bundler updates |
| `security` | `#dc2626` | Authentication safeguards, RLS breaches, or API token audits |
| `documentation` | `#475569` | Markdown updates, docs, workflow charts, and wiki entries |

### Flow Status (Prefix: None)
These labels highlight the operational bottleneck or current block.

| Label Name | Color (HEX) | Description |
| :--- | :--- | :--- |
| `blocked` | `#b91c1c` | Blocked by external services, pending code, or unresolved questions |
| `needs review` | `#d97706` | Developer code ready for peer review or human authorization |
| `needs-design` | `#a21caf` | UI requires Figma mockups or design specification confirmation |
| `needs-product-review` | `#4f46e5` | Requires product verification for business rules or feature sign-off |
| `needs-db-review` | `#ea580c` | Database schema change requires dedicated database engineer approval |
| `needs-mobile-validation` | `#059669` | Code must be validated on physical/emulated mobile viewport before merge |
| `high priority` | `#b91c1c` | Core blocker or high-risk task that must be resolved next |
| `production-risk` | `#7f1d1d` | High-impact changes to billing, authentication, or production migrations |

---

## 📅 Milestones Definition & Success Criteria

Welo Platform tracks work across 8 primary milestones. No task should exist outside a milestone.

### 1. MVP Foundation
- **Scope:** Base Next.js configuration, DB schema initialization, authentication, global theme integration, and baseline layout.
- **Success Criteria:** User can register/login, navigate a sidebar, and view a baseline dashboard on local/preview environments.

### 2. Dispatch System
- **Scope:** Interactive scheduler grid, live dispatcher assignment screens, service call status queues, and real-time updates.
- **Success Criteria:** Dispatcher can create a service call, assign a technician, drag-and-drop slots, and transition states.

### 3. Technician Mobile App
- **Scope:** Mobile-first layout, job execution list, checklist steps, photo capture integrations, and offline sync caching.
- **Success Criteria:** Technician can perform a step-by-step job flow, view updates offline, and resync once online.

### 4. Machine History
- **Scope:** QR code scanning structure, chronological maintenance logs, asset metadata views, and diagnostic attachment lists.
- **Success Criteria:** Scanning/selecting a machine displays all previous repairs, dispatcher notes, and replacement parts history.

### 5. Inventory System
- **Scope:** Truck parts inventory tracking, restock alerts, service-call consumption logs, and purchase requisition requests.
- **Success Criteria:** Parts are automatically decremented when a technician completes a job; stock alerts trigger when inventory falls below thresholds.

### 6. AI Layer
- **Scope:** Automated report summaries, smart scheduling routing optimizations, and voice-to-text technician note parsing.
- **Success Criteria:** AI successfully summarizes 10+ page technician repair logs and suggests next-available scheduling slots.

### 7. Analytics Layer
- **Scope:** Machine failure rate reports, technician performance dashboards, response times analytics, and cost metrics.
- **Success Criteria:** Dispatcher can download CSV/PDF summaries displaying monthly fleet metrics and performance reports.

### 8. Production Readiness
- **Scope:** End-to-end security audits, full production environment stress testing, backup validation, and telemetry dashboard.
- **Success Criteria:** Application passes WCAG AA a11y tests, zero open RLS issues remain, and automated CI/CD pipeline completes successfully.

---

## 📊 Projects v2 Board Workflow

The Project board coordinates developer and AI-agent actions. The card flow must traverse 7 columns:

```
[Backlog] ➔ [Planned] ➔ [In Progress] ➔ [Review] ➔ [Testing] ➔ [Ready for Deploy] ➔ [Done]
```

### Column Criteria & Transitions

1. **Backlog:**
   - *Description:* Ideas, low-priority issues, or draft features.
   - *Rule:* Open to all team members. No milestone assignment required.

2. **Planned:**
   - *Description:* Commited tasks prioritized for the active sprint/milestone.
   - *Rule:* Must have a milestone, estimated difficulty, and clear assignee.

3. **In Progress:**
   - *Description:* Active implementation by developer or AI agent.
   - *Rule:* Maximum 2 active tickets per developer. Must reference a branch name.

4. **Review:**
   - *Description:* Pull Request created, awaiting code review.
   - *Rule:* Blocked from merge until peer approval and template validation checks pass.

5. **Testing:**
   - *Description:* Staging verification, visual checking, and manual testing.
   - *Rule:* Mobile verification and accessibility checks are performed here.

6. **Ready for Deploy:**
   - *Description:* PR approved and merged to `staging`. Awaiting release tag push to `main`.
   - *Rule:* Only release-coordinator holds merge authorization.

7. **Done:**
   - *Description:* Deployed to production (`app.welo.app`), telemetry verified.
   - *Rule:* Automatically closed.

---

## 🤖 AI-Agent Integration Guidelines

- **Goal Matching:** AI subagents must verify the milestone and priority labels of a card before requesting branch assignment.
- **Task Alignment:** Issue cards assigned to the AI must follow the structure outlined in the `ai_workflow_task.md` template.
- **Review Loop:** Any work under the `ai` banner automatically applies the `needs review` label when submitting a PR.
