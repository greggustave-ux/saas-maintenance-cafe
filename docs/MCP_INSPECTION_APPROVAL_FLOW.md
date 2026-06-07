# MCP Inspection Approval Flow & Templates - Welo Platform SaaS

This document establishes the approval gates, human-in-the-loop validation checkpoints, and standardized audit report templates required before design variables can be migrated or synchronized. It defines how approval gates block active operations to maintain code and design system integrity.

---

## 🚧 Approval Gates & Active Operation Blockers

Before any discovered design change or token mismatch can be implemented in the codebase, the proposed change must pass five strict review gates. These gates explicitly block any automated synchronizations or direct mutations.

### 1. Human Review Gate
- **Requirement:** A developer must inspect the raw JSON output report generated in `/scratch/figma-audit.json`.
- **Checkpoint:** The developer must manually verify every token mismatch and layout warning.
- **Active Blocker:** Auto-sync routines and AI-driven codebase writes are strictly blocked. No code changes will be applied without a manually signed-off review form.

### 2. Audit Validation Gate
- **Requirement:** The generated audit report must contain zero unexpected anomalies, syntax errors, or unparseable JSON nodes.
- **Active Blocker:** Any parsing error, missing schema fields, or unknown parameters automatically rejects the audit run, halting the flow.

### 3. Risk Classification Gate
- **Requirement:** Check the risk rating of the target component (Low, Medium, High).
- **Active Blocker:** Components flagged as `high` risk (e.g. `DispatchKanbanBoard`, modal components) require senior developer peer-review and sign-off before being manually integrated.

### 4. Mapping Review Gate
- **Requirement:** Confirm that the Figma node ID corresponds to a valid element registered in `docs/COMPONENT_REGISTRY.md`.
- **Active Blocker:** If the Figma node is not mapped or listed, the flow is blocked until the mapping is verified and registered.

### 5. Mobile Impact Review Gate
- **Requirement:** Analyze whether the design change alters responsive layouts or touch target sizes on viewport sizes <= 640px.
- **Active Blocker:** Any styling change that reduces interactive elements or touch dimensions below the standard minimum threshold of **44px** is automatically blocked and rejected.

---

## 📋 Standardized Audit Report Templates

The following templates represent the standardized JSON blocks generated during passive design system audits. They define the format for all output reports:

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

---

## 🚨 Emergency Stop Integration
If at any point in the approval flow an automated tool attempts to bypass a gate or perform active mutations, the process triggers an immediate halt. Refer to [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md#L51-L62) for triggers and procedures.

---

## 📂 Reference Integration Guidelines

Refer to these architectural documents for specific implementation details:
- **First Passive Inspection:** [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md)
- **First Connection Checklist:** [docs/MCP_FIRST_CONNECTION_CHECKLIST.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIRST_CONNECTION_CHECKLIST.md)
- **Security Rules & Governance:** [docs/MCP_SECURITY_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_SECURITY_RULES.md)
- **Figma Permission Boundaries:** [docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_FIGMA_PERMISSION_BOUNDARIES.md)
- **Audit Output Spec:** [docs/MCP_AUDIT_OUTPUT_SPEC.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_AUDIT_OUTPUT_SPEC.md)
- **Local Sandbox Setup:** [docs/MCP_LOCAL_SANDBOX_SETUP.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_LOCAL_SANDBOX_SETUP.md)
- **MCP Setup Checklist:** [MCP_SETUP_CHECKLIST.md](file:///c:/Users/Dylan/Documents/welo_platform/MCP_SETUP_CHECKLIST.md)
