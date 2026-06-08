export type ComponentCategory =
  | 'Mobile/List'
  | 'Mobile/Widget'
  | 'Mobile/Routing'
  | 'Mobile/Interactive'
  | 'Desktop/Dashboard'
  | 'Desktop/Widget'
  | 'Desktop/Overlay'
  | 'Unified/Timeline'
  | 'Unified/Badge'
  | 'Unified/Preview'
  | 'Unified/Indicator';

export interface ComponentMetadata {
  componentId: string;
  version: string;
  lifecycleStage: 'draft' | 'experimental' | 'validated' | 'production-approved' | 'deprecated';
  figmaNodeMapping: string;
  syncRiskLevel: 'low' | 'medium' | 'high';
  auditTags: string[];
  lastAuditedAt?: string;
}
