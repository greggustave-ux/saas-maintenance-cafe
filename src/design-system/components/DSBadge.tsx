import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export type DSBadgeCategory = 'status' | 'priority' | 'neutral';

export type DSBadgeVariant =
  | 'new' | 'assigned' | 'on_the_way' | 'on_site' | 'waiting_parts' | 'completed' | 'closed' | 'cancelled'
  | 'low' | 'medium' | 'high' | 'urgent'
  | 'default' | (string & {});

export interface DSBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: DSBadgeCategory;
  variant: DSBadgeVariant;
  label?: string;
  className?: string;
}

export const DSBadge: React.FC<DSBadgeProps> & { metadata: typeof COMPONENT_REGISTRY.DSBadge } = ({
  category,
  variant,
  label,
  className = '',
  ...props
}) => {
  const getLabel = () => {
    if (label) return label;
    switch (variant) {
      case 'new': return 'Nouveau';
      case 'assigned': return 'Assigné';
      case 'on_the_way': return 'En route';
      case 'on_site': return 'Sur place';
      case 'waiting_parts': return 'En attente de pièces';
      case 'completed': return 'Terminé';
      case 'closed': return 'Clos';
      case 'cancelled': return 'Annulé';
      case 'low': return 'Faible';
      case 'medium': return 'Moyenne';
      case 'high': return 'Élevée';
      case 'urgent': return 'Urgente';
      default: return variant;
    }
  };

  const getBadgeColors = () => {
    if (category === 'priority') {
      switch (variant) {
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
    } else if (category === 'status') {
      switch (variant) {
        case 'new':
          return 'border-sky-200 dark:border-sky-900/30 bg-sky-50/70 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400';
        case 'assigned':
          return 'border-indigo-200 dark:border-indigo-900/30 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400';
        case 'on_the_way':
          return 'border-amber-200 dark:border-amber-900/30 bg-amber-50/70 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400';
        case 'on_site':
          return 'border-blue-200 dark:border-blue-900/30 bg-blue-50/70 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400';
        case 'waiting_parts':
          return 'border-purple-200 dark:border-purple-900/30 bg-purple-50/70 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400';
        case 'completed':
          return 'border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400';
        case 'closed':
          return 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
        case 'cancelled':
          return 'border-red-200 dark:border-red-900/30 bg-red-50/70 dark:bg-red-950/20 text-red-700 dark:text-red-400';
        default:
          return 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400';
      }
    } else {
      // neutral
      return 'border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-450';
    }
  };

  return (
    <span
      data-welo-component="DSBadge"
      className={`inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm,4px)] text-[10px] font-bold border ${getBadgeColors()} ${className}`}
      role="status"
      aria-label={`${category}: ${getLabel()}`}
      {...props}
    >
      {getLabel()}
    </span>
  );
};

DSBadge.metadata = COMPONENT_REGISTRY.DSBadge;
export default DSBadge;
