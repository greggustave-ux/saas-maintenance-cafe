import { ComponentMetadata } from './component-types';

export const COMPONENT_REGISTRY: Record<string, ComponentMetadata> = {
  StatusBadge: {
    componentId: 'StatusBadge',
    version: '1.0.0',
    lifecycleStage: 'production-approved',
    figmaNodeMapping: 'figma.com/file/welo-ui?node-id=101:4',
    syncRiskLevel: 'low',
    auditTags: ['Unified/Badge', 'InterTypography', 'WCAG-AA-Pass'],
    lastAuditedAt: '2026-06-06',
  },
  PriorityBadge: {
    componentId: 'PriorityBadge',
    version: '1.0.0',
    lifecycleStage: 'production-approved',
    figmaNodeMapping: 'figma.com/file/welo-ui?node-id=102:5',
    syncRiskLevel: 'low',
    auditTags: ['Unified/Badge', 'InterTypography', 'HighContrast'],
    lastAuditedAt: '2026-06-06',
  },
  OfflineSyncIndicator: {
    componentId: 'OfflineSyncIndicator',
    version: '1.0.0',
    lifecycleStage: 'validated',
    figmaNodeMapping: 'figma.com/file/welo-ui?node-id=205:12',
    syncRiskLevel: 'low',
    auditTags: ['Unified/Indicator', 'OfflineSafety', 'RealtimeState'],
    lastAuditedAt: '2026-06-06',
  },
  MobileBottomNavigation: {
    componentId: 'MobileBottomNavigation',
    version: '1.0.0',
    lifecycleStage: 'production-approved',
    figmaNodeMapping: 'figma.com/file/welo-ui?node-id=309:8',
    syncRiskLevel: 'medium',
    auditTags: ['Mobile/Routing', 'TouchTarget44', 'OneThumbNavigation'],
    lastAuditedAt: '2026-06-06',
  }
};
