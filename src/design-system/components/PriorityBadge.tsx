import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export type WeloPriority = 'low' | 'medium' | 'high' | 'urgent' | (string & {});

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
      case 'low':
        return 'bg-slate-500/10 text-slate-650 dark:text-slate-400 border-slate-500/25';
      case 'medium':
        return 'bg-blue-500/10 text-blue-750 dark:text-blue-400 border-blue-500/25';
      case 'high':
        return 'bg-orange-500/10 text-orange-705 dark:text-orange-400 border-orange-500/20';
      case 'urgent':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 border-transparent';
    }
  };

  const getLabel = () => {
    switch (priority) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyenne';
      case 'high': return 'Élevée';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  return (
    <span
      data-welo-component="PriorityBadge"
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeColors()} ${className}`}
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
