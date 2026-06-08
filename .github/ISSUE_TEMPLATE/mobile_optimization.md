---
name: "📱 Mobile Optimization"
about: Track mobile responsiveness, offline sync, touch gestures, or performance fixes
title: "mobile: [Short Description]"
labels: ["mobile", "performance"]
assignees: ""
---

## 📱 Mobile Issue / Optimization Opportunity
Explain the responsive breakage, touch target issues, offline sync failures, or layout issues on mobile views.

## 📐 Layout & Touch Targets
- What viewport widths are broken? (e.g., iPhone SE/320px, iPad/768px, etc.)
- Are touch targets at least 44x44px?
- Does the layout use safe-area padding for devices with notches?

## 📶 Offline & Sync Considerations
- Does this component need offline availability?
- Explain local state caching or synchronization strategies (using Supabase cache, indexedDB, or React state).

## 🚀 Performance Audit
- List any slow-loading assets, heavy rerenders, or network blocking operations on slower networks.
