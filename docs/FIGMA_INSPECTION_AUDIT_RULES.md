# Figma Inspection Audit Rules - Welo Platform SaaS

This document establishes the Figma Inspection Audit Rules for the Welo Platform. It defines the logging rules, JSON schemas, verification guidelines, and reporting metrics required for design audit compliance.

---

## 📋 Audit Logging Requirements

Every passive Figma inspection must record its operation metadata to ensure complete audit capability:
- **Output File Path:** Logs must be written directly to the `/scratch/figma-audit.json` file inside the local workspace.
- **Commit Trails:** Following review of an audit log, the developer must commit the report along with a descriptive commit trail documenting the findings.
- **Storage Boundary:** Audit logs must never contain user profiles, passwords, or personal credentials.

---

## 📊 Audit Log JSON Schema

The output audit file must comply with the design audit format defined in [docs/MCP_AUDIT_OUTPUT_SPEC.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_AUDIT_OUTPUT_SPEC.md). Every report must declare:

```json
{
  "$schema": "https://welo.app/schemas/mcp-figma-audit-v1.json",
  "timestamp": "2026-06-07T12:00:00Z",
  "session": {
    "developer": "Dylan",
    "figmaFileKey": "restricted_test_key"
  },
  "summary": {
    "totalNodesChecked": 45,
    "driftsDetected": 0,
    "warnings": 0
  },
  "results": [
    {
      "nodeId": "101:4",
      "nodeName": "StatusBadge",
      "status": "aligned",
      "details": {
        "colorChecked": "hsla(190, 90%, 50%, 1.0)",
        "codeProperty": "var(--status-new)"
      }
    }
  ]
}
```

---

## 🛠️ Verification & Compliance Checks

Before approving an audit log, developers must verify the following checks:
1. **Scope Compliance:** Verify that only allowed Figma objects (`FRAME`, `TEXT`, `COMPONENT`) are recorded.
2. **Warning Auditing:** Any accessibility warning (such as touch areas < 44px) must be logged as `review-required` and flagged to the design team.
3. **Write Detection Scan:** Confirm that the log files contains zero write operations or webhook trigger requests.

---

## 📂 Reference Guidelines
- **Figma Read-Only Governance:** [docs/FIGMA_READ_ONLY_GOVERNANCE.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_READ_ONLY_GOVERNANCE.md)
- **Inspection Boundaries:** [docs/FIGMA_INSPECTION_BOUNDARIES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_INSPECTION_BOUNDARIES.md)
- **Component Access Matrix:** [docs/FIGMA_COMPONENT_ACCESS_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_COMPONENT_ACCESS_MATRIX.md)
- **Emergency Stop Protocol:** [docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIGMA_EMERGENCY_STOP_PROTOCOL.md)
- **First Passive Inspection:** [docs/FIRST_PASSIVE_MCP_INSPECTION.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/FIRST_PASSIVE_MCP_INSPECTION.md)
- **Inspection Approval Flow:** [docs/MCP_INSPECTION_APPROVAL_FLOW.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_INSPECTION_APPROVAL_FLOW.md)
- **Audit Output Spec:** [docs/MCP_AUDIT_OUTPUT_SPEC.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MCP_AUDIT_OUTPUT_SPEC.md)
- **PDF UI Protection:** [docs/PDF_UI_PROTECTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/PDF_UI_PROTECTION_RULES.md)
- **Mobile Critical Interactions:** [docs/MOBILE_CRITICAL_INTERACTION_RULES.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/MOBILE_CRITICAL_INTERACTION_RULES.md)
- **Risk Classification Matrix:** [docs/RISK_CLASSIFICATION_MATRIX.md](file:///c:/Users/Dylan/Documents/welo_platform/docs/RISK_CLASSIFICATION_MATRIX.md)
