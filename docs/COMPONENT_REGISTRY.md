# Component Registry - Welo Platform SaaS

This document establishes the centralized operational component registry for Welo Platform. It acts as an MCP-readable registry mapping frontend React components to Figma design components and tracks their specifications, token references, and sync risk levels.

---

## 🤖 MCP-Readable Registry & Tagging System
Each component is tagged to allow AI subagents to parse boundaries and schemas.
Tags structure: `[Category] [LifecycleState] [SyncRisk]`

---

## 📦 Component Inventory

### 1. ServiceCallCard
- **Tags:** `[Mobile/List]` `[production-approved]` `[SyncRisk: Medium]`
- **Purpose:** Renders brief job information for technicians on mobile lists.
- **Props:**
  - `id: string`
  - `title: string`
  - `customerName: string`
  - `address: string`
  - `status: 'pending' | 'active' | 'completed' | 'blocked'`
- **States:** Default, Tap-active, Long-press menu.
- **Mobile Behavior:** Full-width container; padding `16px`; touch target for card is active; swipes left to show quick actions.
- **Accessibility:** `role="button"`, `aria-label="Job title at address, status status"`, full keyboard focus outlines.
- **Loading State:** Shimmering skeleton card placeholder matching structural metrics.
- **Offline State:** Cached metadata indicator pill shown if the system is disconnected.
- **Failure State:** Inline error text "Unable to load card details" with retry button.
- **Security Considerations:** Never display client's billing details on list previews. Only show operational dispatch location data.
- **Token References:** `--radius-lg`, `--space-md`, `--status-<status>`, `--font-size-base`.

### 2. DispatchKanbanBoard
- **Tags:** `[Desktop/Dashboard]` `[production-approved]` `[SyncRisk: High]`
- **Purpose:** Full drag-and-drop workflow tracking panel for dispatchers.
- **Props:**
  - `columns: ColumnData[]`
  - `onCardMove: (cardId: string, fromColumn: string, toColumn: string) => Promise<void>`
- **States:** Idle, Dragging card, Transition pending, Refreshing.
- **Mobile Behavior:** Horizontal scroll of full-width columns or converted into accordion panels (requires desktop viewport warning).
- **Accessibility:** Keyboard navigation for moves (using spacebar to pick and arrows to re-position cards), aria-live announcement of drag-and-drop result.
- **Loading State:** Skeleton column headers and loading spinners.
- **Offline State:** Board is frozen for edits. Displays indicator "Offline: Actions queued".
- **Failure State:** Retains previous stable card positions, prints banner error "Failed to sync updates, retrying".
- **Security Considerations:** Ensure client-side moves only send changes via authenticated API calls with token audits.
- **Token References:** `--z-index-base`, `--space-lg`, `--card-bg`.

### 3. DispatchKanbanCard
- **Tags:** `[Desktop/Widget]` `[production-approved]` `[SyncRisk: Medium]`
- **Purpose:** Inner ticket preview card nested in Kanban columns.
- **Props:**
  - `cardId: string`
  - `title: string`
  - `priority: 'standard' | 'critical'`
  - `technicianName?: string`
- **States:** Default, Hover, Dragging, Selected.
- **Mobile Behavior:** Drag disabled on screen widths under 768px (fallback to tap menu).
- **Accessibility:** Focus-visible ring, key press listener for move selections.
- **Loading & Offline:** Shimmer preview; read-only tag.
- **Token References:** `--radius-md`, `--shadow-sm`, `--space-sm`.

### 4. MachineHistoryTimeline
- **Tags:** `[Unified/Timeline]` `[validated]` `[SyncRisk: Low]`
- **Purpose:** Displays historic repair logs chronologically.
- **Props:**
  - `historyItems: TimelineItem[]`
- **States:** Idle, Scrolling, Detail-Expanded.
- **Mobile Behavior:** Native physics vertical scrolling; touch-friendly timeline circles (>=44px clickable zone).
- **Accessibility:** List role, semantic structure `<ol>` and `<li>`.
- **Offline State:** Shows cached timeline items with offline warning indicators.
- **Token References:** `--space-md`, `--font-size-sm`, `--card-border`.

### 5. ClientLocationCard
- **Tags:** `[Mobile/Widget]` `[validated]` `[SyncRisk: Low]`
- **Purpose:** Renders maps linkage and address details.
- **Props:**
  - `address: string`
  - `coords: { lat: number; lng: number }`
- **States:** Map loaded, Map static, Navigation open.
- **Mobile Behavior:** Tap opens native maps client (Apple Maps / Google Maps) with navigation bounds.
- **Accessibility:** High-contrast text labels.
- **Token References:** `--radius-lg`, `--touch-target-min`.

### 6. TechnicianAssignmentPanel
- **Tags:** `[Desktop/Overlay]` `[validated]` `[SyncRisk: High]`
- **Purpose:** Modal to pick and assign a technician to a service call.
- **Props:**
  - `technicians: Technician[]`
  - `onAssign: (techId: string) => void`
- **States:** Searching, Selecting, Confirming.
- **Security:** Requires dispatcher authorization checks before writing mutations.
- **Token References:** `--z-index-modal`, `--radius-xl`.

### 7. SignatureCapture
- **Tags:** `[Mobile/Interactive]` `[validated]` `[SyncRisk: High]`
- **Purpose:** Touch-canvas to collect user signatures.
- **Props:**
  - `onSave: (signatureBlob: Blob) => void`
- **States:** Blank, Drawing, Signed, Resetting.
- **Mobile Behavior:** Captures TouchEvents and locks window scrolling while drawing to prevent canvas shift.
- **Offline State:** Saves signature as local base64 string in IndexedDB/LocalStorage for delayed sync.
- **Token References:** `--touch-target-min`, `--space-md`.

### 8. PhotoUploadSection
- **Tags:** `[Mobile/Interactive]` `[validated]` `[SyncRisk: Medium]`
- **Purpose:** Technician job photo upload tool.
- **Props:**
  - `onFileAdd: (file: File) => void`
- **States:** Empty, Camera open, Image compressing, Uploading, Success, Error.
- **Offline State:** Stores local blob keys and schedules queue upload when connection returns.
- **Token References:** `--radius-md`, `--space-sm`.

### 9. PDFReportPreview
- **Tags:** `[Unified/Preview]` `[experimental]` `[SyncRisk: Medium]`
- **Purpose:** Renders draft PDF summaries of completed visits.
- **Props:**
  - `reportUrl: string`
- **Token References:** `--radius-lg`, `--space-lg`.

### 10. StatusBadge
- **Tags:** `[Unified/Badge]` `[production-approved]` `[SyncRisk: Low]`
- **Purpose:** Renders small status badges.
- **Props:**
  - `status: 'pending' | 'active' | 'completed' | 'blocked'`
- **Token References:** `--radius-sm`, `--status-<status>`.

### 11. PriorityBadge
- **Tags:** `[Unified/Badge]` `[production-approved]` `[SyncRisk: Low]`
- **Purpose:** Highlights critical work orders.
- **Props:**
  - `priority: 'standard' | 'critical'`
- **Token References:** `--radius-sm`, `--status-blocked` (for critical).

### 12. MobileBottomNavigation
- **Tags:** `[Mobile/Routing]` `[production-approved]` `[SyncRisk: Medium]`
- **Purpose:** Core navigation footer for mobile users.
- **Props:**
  - `activeTab: string`
- **States:** Tab selected, transition indicator.
- **Mobile Behavior:** Positioned fixed at bottom. Touch target bounds exactly `48x64px`.
- **Token References:** `--z-index-sticky`, `--touch-target-min`.

### 13. OfflineSyncIndicator
- **Tags:** `[Unified/Indicator]` `[validated]` `[SyncRisk: Low]`
- **Purpose:** Bar displaying synchronization status of local DB cache.
- **Props:**
  - `status: 'synced' | 'syncing' | 'offline'`
  - `queuedCount: number`
- **States:** Synced (disappears after 3s), Syncing (spinning icon), Offline (persistent banner).
- **Token References:** `--z-index-sticky`, `--status-pending` (syncing), `--status-blocked` (offline).

---

## 🎨 Automated UI Audit Compatibility
To ensure that future automated tools can verify design-code compliance:
- Every component root element must declare a data attribute matching its registry name, e.g. `data-welo-component="ServiceCallCard"`.
- Token validations check that only theme properties (e.g. `var(--primary)`) are present in styled classes.
