# MCP Audit Output Specification - Welo Platform SaaS

This document establishes the JSON schemas and properties for local read-only design audit reports. It provides a standardized data model for reviewing token alignment, component mappings, and accessibility risks prior to developer approval.

---

## 📊 Standard Audit Report Schema

A local design system audit outputs a single report complying with the following structural schema:

```json
{
  "$schema": "https://welo.app/schemas/mcp-design-audit-v1.json",
  "timestamp": "2026-06-06T18:33:00Z",
  "auditScope": {
    "branchName": "feature/mcp-figma-preparation",
    "commitHash": "e1a9ec17822a"
  },
  "summary": {
    "totalDrifts": 3,
    "totalWarnings": 2,
    "registryCompliancePercent": 94.5
  },
  
  "discoveredComponents": [
    {
      "componentId": "ServiceCallCard",
      "figmaNodeId": "201:10",
      "weloRegistryMapping": "ServiceCallCard",
      "metadata": {
        "version": "1.0.0",
        "lifecycleStage": "production-approved",
        "syncRiskLevel": "medium"
      }
    }
  ],
  
  "missingMappings": [
    {
      "nodeId": "205:44",
      "nodeName": "PartsItemRowContainer",
      "type": "unmapped_container",
      "severity": "review-required",
      "recommendation": "Add to COMPONENT_REGISTRY.md under Tier 2 candidate list"
    }
  ],
  
  "tokenMismatches": [
    {
      "tokenName": "colors/cyan-500",
      "figmaValue": "hsla(190, 90%, 50%, 1.0)",
      "codeValue": "#0891b2",
      "driftType": "color_format_mismatch",
      "severity": "review-required"
    }
  ],
  
  "accessibilityRisks": [
    {
      "nodeId": "101:4",
      "nodeName": "StatusBadge",
      "propertyChecked": "contrastRatio",
      "value": "3.8:1",
      "requirement": ">= 4.5:1",
      "severity": "review-required",
      "description": "Light-blue text on transparent sky-50 background has low legibility on dark mode viewports."
    },
    {
      "nodeId": "114:2",
      "nodeName": "Désarchiver Button",
      "propertyChecked": "touchTargetSize",
      "value": "32px",
      "requirement": ">= 44px",
      "severity": "review-required",
      "description": "Interactive selector fails standard minimum touch-target metric."
    }
  ],
  
  "mobileResponsivenessWarnings": [
    {
      "nodeId": "201:11",
      "nodeName": "DispatchCard",
      "warningType": "horizontal_overflow_risk",
      "description": "Grid row containing machine serial and technician select boxes risks text clipping on screen widths under 360px.",
      "severity": "review-required"
    }
  ],
  
  "unknownComponentClassifications": [
    {
      "nodeId": "310:1",
      "nodeName": "LegacyPhotoUploader",
      "unsupportedVariants": ["drag-to-upload"],
      "severity": "review-required"
    }
  ]
}
```

---

## 🔬 Field Explanations & Types

- **`discoveredComponents`:** Array of components that are successfully linked between Figma and React component code definitions.
- **`missingMappings`:** Highlights Figma frames that have no corresponding registration metadata block in the codebase.
- **`tokenMismatches`:** Discovers differences in variable values, such as spacing deviations (e.g. Figma variable is 16px, but CSS matches 20px).
- **`accessibilityRisks`:** Flags violations of touch target dimensions (height < 44px) or WCAG contrast warnings (contrast < 4.5:1 for active text).
- **`mobileResponsivenessWarnings`:** Reports layout settings (e.g., non-wrapping flex containers, fixed pixel widths) that present horizontal overflow risks on mobile devices.
- **`unknownComponentClassifications`:** Flags design variants that lack defined props or typescript version signatures in the code.
