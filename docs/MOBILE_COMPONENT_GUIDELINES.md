# Mobile Component Guidelines - Welo Platform SaaS

This document establishes the mobile-first UX guidelines and technical architecture for the operational components used by technicians on-site and dispatchers.

---

## 📱 Mobile-First UX Requirements

Welo Platform's mobile views are designed for field workers operating in high-stress, low-visibility, and offline environments.

### 1. One-Thumb Navigation Priority
- Core interaction nodes (buttons, tabs, selectors) must be placed in the bottom 40% of the screen (the "Thumb Zone") for easy single-handed access.
- Actions requiring multi-step inputs must utilize full-height slide-up sheets that slide from the bottom.

### 2. Touch Target Safety (Minimum 44x44px)
- Every button, toggle, and navigation anchor must have an active tap target size of at least **44x44px**.
- Checkbox labels and list items must incorporate padding overrides to extend their clickable boundaries.

### 3. Low Cognitive Load Layouts
- **Task Focus:** Display only one primary action per view (e.g., "Confirm Arrival" or "Submit Signature"). Secondary actions must be nested or visually muted.
- **Form Design:** Form inputs must be single-column with large placeholder values, clear error cues, and native hardware keyboard helpers.

### 4. High Contrast Operational Mode
- Ensure contrast satisfies WCAG AA ratios (minimum 4.5:1 for regular text, 3:1 for large text).
- Colors must be distinct: use semantic badges so status checks do not rely on color alone (e.g. combine warning colors with status label text).

### 5. Offline-Ready Architecture
- Components must display instantaneous loading or optimistic state changes immediately, before network response triggers.
- Caching indicators (e.g. "Synced locally") must display clearly.

---

## 📦 Operational Components Standardization

All components are implemented as Next.js functional components using CSS variables.

### 1. ServiceCallCard
- **Usage:** Displays job assignment, location, time, and type on mobile list views.
- **Structure:** Bounding box card, status badge, title, location string, and primary touch action trigger (e.g. "View details").

### 2. DispatchKanbanCard
- **Usage:** Used on the dispatcher dashboard for drag-and-drop workflow tracking.
- **Structure:** Compact preview containing ticket ID, technician assigned avatar, date, and priority indicators.

### 3. MachineHistoryCard
- **Usage:** Displays a single maintenance action timeline node in machine details.
- **Structure:** Left-aligned chronological connector line, date string, name of technician, summary of repair, and parts consumed list.

### 4. TechnicianBadge
- **Usage:** Identifies active technician details.
- **Structure:** Small circle avatar, name, and color indicator of active status (Active / Offline).

### 5. StatusBadge
- **Usage:** General status flags.
- **Structure:** Rounded container utilizing `--radius-sm`, semantic HSL color backgrounds, and capitalized text:
  - `PENDING` (Orange, `--status-pending`)
  - `ACTIVE` (Cyan, `--status-active`)
  - `COMPLETED` (Green, `--status-completed`)
  - `BLOCKED` (Red, `--status-blocked`)

### 6. PriorityBadge
- **Usage:** Highlights urgency of tickets.
- **Structure:** Red-tinted or neutral badge highlighting:
  - `CRITICAL` (Dark red, `--status-blocked`)
  - `STANDARD` (Neutral slate, `--foreground` at low opacity)

### 7. MobileBottomNavigation
- **Usage:** The core app routing bar on mobile viewports.
- **Structure:** Fixed bottom navigation container (`--z-index-sticky`), containing 3 to 4 quick navigation keys: "Jobs", "History", "Inventory", "Settings". Height must be exactly `64px` to host safe touch targets.

### 8. SignatureCapture
- **Usage:** On-screen canvas to record client sign-off on jobs.
- **Structure:** Canvas wrapper, "Clear" and "Save" touch buttons (at least 48px height), and validation status. Saves to local storage before pushing to Supabase bucket storage.

### 9. PhotoUploadSection
- **Usage:** Used by technicians to attach job site photos.
- **Structure:** Dotted camera button container (at least 80x80px target), thumbnail grid with "Delete" buttons, and upload progress bar.

### 10. PDFPreviewCard
- **Usage:** Renders summaries of completed jobs.
- **Structure:** Inline document icon, date stamp, file size string, and "Download/View" touch triggers.

---

## ⚡ Performance Rules
- **Fast-Loading Cards:** Cards must not fetch deep relational data dynamically. Retrieve only core details and fetch relations when navigating into detail views.
- **Lazy Rendering:** Lists containing 20+ cards must use virtual lists or standard pagination to prevent mobile browser memory exhaustion.
- **Tap Latency:** CSS custom transition rules must enforce `-webkit-tap-highlight-color: transparent` to override default browser delay on touch click events.
