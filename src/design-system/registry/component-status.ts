export type ComponentLifecycleStage = 'draft' | 'experimental' | 'validated' | 'production-approved' | 'deprecated';

export const LIFECYCLE_STAGE = {
  DRAFT: 'draft',
  EXPERIMENTAL: 'experimental',
  VALIDATED: 'validated',
  PRODUCTION_APPROVED: 'production-approved',
  DEPRECATED: 'deprecated',
} as const;
