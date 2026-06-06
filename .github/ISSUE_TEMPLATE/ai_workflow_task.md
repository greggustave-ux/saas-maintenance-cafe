---
name: "🤖 AI Workflow Task"
about: Define structured tasks and instructions for Antigravity AI agent execution
title: "ai: [Short Description]"
labels: ["ai", "needs review"]
assignees: ""
---

## 🤖 Context & Goal
Provide the background for this task and the exact desired outcome. Reference any applicable [PROJECT_AI_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/PROJECT_AI_RULES.md) or [DESIGN_SYSTEM_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_RULES.md).

## 🧭 Step-by-Step AI Execution Instructions
Detailed guidelines for the AI agent to follow:
1. **Research:** (e.g. identify relevant files, components, and schema definitions)
2. **Implementation:** 
   - Ensure all typography uses the **Inter** system and HSL variables.
   - Implement styles in a **mobile-first** hierarchy.
   - Maintain strict keyboard accessibility and focus indicator support.
3. **Testing:** (e.g. verify responsive breakpoints down to 320px, check touch target sizes of 44x44px, build locally)

## 🛡️ Safety Constraints & Human Review Checkpoints
- What actions are **forbidden** for autonomous execution? (e.g. executing SQL migrations directly, updating RLS rules, pushing directly to staging/main)
- Where must the agent **STOP** and ask for human review? (Refer to [PROJECT_AI_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/PROJECT_AI_RULES.md) boundaries)

## 📝 Expected Deliverables
- [ ] Modified code files conforming to [DESIGN_SYSTEM_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/DESIGN_SYSTEM_RULES.md)
- [ ] Walkthrough documentation (e.g. `walkthrough.md`)
- [ ] Test verification results showing responsive checks and accessibility compliance
