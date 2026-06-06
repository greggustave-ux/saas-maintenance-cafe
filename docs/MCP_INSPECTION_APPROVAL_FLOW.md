# MCP Inspection Approval Flow & Templates - Welo Platform SaaS

This document establishes the approval gates, human-in-the-loop validation checkpoints, and standardized audit report templates required before design variables can be migrated or synchronized.

---

## 🚧 Approval Gates for Design System Alignment

Before any discovered design change can be implemented, it must pass five strict review gates:

### 1. Human Review Gate
- **Requirement:** A developer must inspect the raw JSON output report and confirm the changes are correct and necessary.
- **Blocker:** No automated merges or git commits.

### 2. Audit Validation Gate
- **Requirement:** The generated audit report must contain zero unexpected anomalies.
- **Blocker:** Any unknown classifications or syntax errors in the JSON report halt the flow.

### 3. Risk Classification Gate
- **Requirement:** Review the sync risk category for the target component.
- **Blocker:** Components flagged as `high` risk (e.g. `DispatchKanbanBoard`, modals) require senior developer sign-off before implementation.

### 4. Mapping Review Gate
- **Requirement:** Confirm that the Figma node ID corresponds to a valid element in `docs/COMPONENT_REGISTRY.md`.
- **Blocker:** Missing mappings must be documented and registered first.

### 5. Mobile Impact Review Gate
- **Requirement:** Check if the design variable affects responsive elements (viewports <= 640px, touch target bounds).
- **Blocker:** Any styling change that reduces touch dimensions below **44px** is automatically rejected.

---

## 📋 Audit Log Report Templates

The following templates represent the standardized JSON blocks generated during passive design system audits:

### 1. Token Mismatch Report Template
```json
{
  "category": "token_mismatch",
  "tokenId": "spacing/space-md",
  "valueInFigma": "16px",
  "valueInCode": "20px",
  "mismatchType": "dimension_deviation",
  "resolution": "Update index.css/variables.css to 16px to match figma design"
}
```

### 2. Unmapped Component Report Template
```json
{
  "category": "unmapped_component",
  "figmaNodeId": "302:14",
  "nodeName": "TechnicianAssignmentPanel",
  "suggestedComponentId": "TechnicianAssignmentPanel",
  "syncRisk": "high",
  "resolution": "Register component metadata block in component-registry.ts"
}
```

### 3. Unsupported Variant Report Template
```json
{
  "category": "unsupported_variant",
  "componentId": "StatusBadge",
  "figmaNodeId": "101:4",
  "variantKey": "state",
  "variantValue": "hover-disabled",
  "resolution": "Code StatusBadge component only supports base states. Update Figma variant."
}
```

### 4. Accessibility Warning Report Template
```json
{
  "category": "accessibility_risk",
  "nodeId": "114:2",
  "nodeName": "Action Button",
  "violation": "touch_target_under_44px",
  "measuredValue": "38px",
  "requiredValue": "44px",
  "resolution": "Adjust padding or min-height to var(--touch-target-min) (44px) in ServiceCallCard"
}
```

### 5. Mobile Layout Warning Report Template
```json
{
  "category": "mobile_layout_warning",
  "nodeId": "201:11",
  "nodeName": "DispatchCardContainer",
  "warningType": "horizontal_scroll_overflow_risk",
  "details": "Three-column grid layout has fixed dimensions and will break viewports under 640px width.",
  "resolution": "Wrap in responsive flex layout rules for small screens"
}
```
