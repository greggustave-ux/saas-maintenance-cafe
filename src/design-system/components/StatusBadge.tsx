import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export type WeloStatus = 'pending' | 'active' | 'completed' | 'blocked';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: WeloStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> & { metadata: typeof COMPONENT_REGISTRY.StatusBadge } = ({
  status,
  className = '',
  ...props
}) => {
  const getLabel = () => {
    switch (status) {
      case 'pending': return 'En Attente';
      case 'active': return 'En Cours';
      case 'completed': return 'Terminé';
      case 'blocked': return 'Bloqué';
      default: return status;
    }
  };

  const getBadgeColors = () => {
    switch (status) {
      case 'pending':
        return 'bg-[var(--status-pending)]/10 text-[var(--status-pending)] border-[var(--status-pending)]/20';
      case 'active':
        return 'bg-[var(--status-active)]/10 text-[var(--status-active)] border-[var(--status-active)]/20';
      case 'completed':
        return 'bg-[var(--status-completed)]/10 text-[var(--status-completed)] border-[var(--status-completed)]/20';
      case 'blocked':
        return 'bg-[var(--status-blocked)]/10 text-[var(--status-blocked)] border-[var(--status-blocked)]/20';
    }
  };

  return (
    <span
      data-welo-component="StatusBadge"
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColors()} ${className}`}
      role="status"
      aria-label={`Status: ${getLabel()}`}
      {...props}
    >
      {getLabel()}
    </span>
  );
};

StatusBadge.metadata = COMPONENT_REGISTRY.StatusBadge;
export default StatusBadge;
