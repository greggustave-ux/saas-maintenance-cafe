import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export type WeloPriority = 'standard' | 'critical';

export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority: WeloPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> & { metadata: typeof COMPONENT_REGISTRY.PriorityBadge } = ({
  priority,
  className = '',
  ...props
}) => {
  const getBadgeColors = () => {
    switch (priority) {
      case 'critical':
        return 'bg-[var(--status-blocked)] text-white border-transparent';
      case 'standard':
      default:
        return 'bg-[var(--card-border)] text-[var(--foreground)] border-transparent';
    }
  };

  const getLabel = () => {
    return priority === 'critical' ? 'Urgent' : 'Normal';
  };

  return (
    <span
      data-welo-component="PriorityBadge"
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColors()} ${className}`}
      role="status"
      aria-label={`Priorité: ${getLabel()}`}
      {...props}
    >
      {getLabel()}
    </span>
  );
};

PriorityBadge.metadata = COMPONENT_REGISTRY.PriorityBadge;
export default PriorityBadge;
