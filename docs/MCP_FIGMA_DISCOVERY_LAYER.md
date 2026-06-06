# MCP Figma Discovery Layer - Welo Platform SaaS

This document establishes the architecture and boundaries of Welo Platform's read-only Figma Discovery Layer. It enables Model Context Protocol (MCP) clients to discover and audit Figma design systems without write access, protecting the workspace from UI drift or unapproved modifications.

---

## 🚫 Read-Only Safety Commitments

To prevent visual regressions or architectural disruption:

- **Strictly Read-Only:** The Figma MCP integration is locked to read-only API calls. Code generation, asset writes, and layout updates are completely disabled.
- **No Automatic Synchronization:** All design-to-code alignments must be manually reviewed and approved. Auto-generated file changes or database schema overrides are blocked.
- **No Workspace Mutations:** React components, global stylesheet files, and local asset libraries cannot be overwritten by automated systems without explicit human check-ins.

---

## 🔬 Discovery Scope & Inspected Properties

The discovery layer enables Antigravity and AI subagents to fetch and inspect the following read-only design properties:

1. **Figma Files:** Read file list, file version history, and file names.
2. **Page Structures:** Audit pages, canvas coordinates, layer trees, and grouping scopes.
3. **Frames & Layouts:** Inspect frame names, auto-layout settings, gutters, alignment metrics, and bounding dimensions.
4. **Components:** Catalog master components, component instances, variants, and metadata descriptions.
5. **Variables & Design Tokens:** Fetch collection variables (spacing scales, border widths, shadow structures, animation speed curves).
6. **Styles:** Discover color styles (HEX/HSL representations), typography styles (font weights, font family, line heights).
7. **Metadata Annotations:** Read dev-mode code notes, links, and frame tagging descriptions.

---

## 📋 Discovered Audit Logging Format

When an audit is executed, the discovery layer outputs a standardized JSON payload summarizing the inspected Figma file. This schema acts as the basis for manual PR verification checks:

```json
{
  "auditId": "audit_2026_06_06_figma_import",
  "inspectedFile": {
    "key": "welo-ui-design-token-file",
    "name": "Welo Platform HSL Design System",
    "versionId": "figma_version_v124_approved"
  },
  "discoveredPages": [
    {
      "pageName": "📐 Tokens & Styles",
      "frameCount": 12,
      "componentCount": 42
    }
  ],
  "discoveredComponents": [
    {
      "figmaNodeId": "101:4",
      "componentId": "StatusBadge",
      "weloRegistryMapping": "StatusBadge",
      "syncRisk": "low"
    }
  ],
  "tokenCandidates": [
    {
      "variableName": "colors/cyan-500",
      "value": "hsla(190, 90%, 50%, 1.0)",
      "mappedCssVariable": "var(--primary)"
    }
  ],
  "mismatches": [
    {
      "nodeId": "205:44",
      "nodeName": "LegacyButtonOutline",
      "type": "unmapped_legacy_style",
      "severity": "review-required",
      "details": "Frame uses hardcoded HEX color #090d16 instead of var(--background)"
    }
  ],
  "missingMappings": [
    {
      "nodeId": "301:12",
      "nodeName": "SignatureCanvasContainer",
      "recommendedRegistryId": "SignatureCapture",
      "syncRisk": "high"
    }
  ]
}
```

---

## 📈 Design Drift & Mismatch Detection

The discovery layer enables AI subagents to detect style drift by comparing local CSS tokens to the exported Figma variable JSON:

- **Token Audits:** Compares values of CSS custom properties inside `globals.css` with Figma collection variables.
- **Node Sync Warnings:** Highlights frames in Figma that do not declare a corresponding `data-welo-component` target attribute in React code templates.
- **Registry Alerts:** Reports components in Welo's local `docs/COMPONENT_REGISTRY.md` that lack a valid `figmaNodeMapping` link, identifying gaps in documentation coverage.
- **Severity Escalation:** Any styling mismatch involving core dashboard panels elevates to `review-required`, stopping automated verification checks.
