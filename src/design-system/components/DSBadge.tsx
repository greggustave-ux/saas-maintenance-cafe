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
          return 'border-status-new-border bg-status-new-bg text-status-new-text';
        case 'assigned':
          return 'border-status-assigned-border bg-status-assigned-bg text-status-assigned-text';
        case 'on_the_way':
          return 'border-status-on-the-way-border bg-status-on-the-way-bg text-status-on-the-way-text';
        case 'on_site':
          return 'border-status-on-site-border bg-status-on-site-bg text-status-on-site-text';
        case 'waiting_parts':
          return 'border-status-waiting-parts-border bg-status-waiting-parts-bg text-status-waiting-parts-text';
        case 'completed':
          return 'border-status-completed-border bg-status-completed-bg text-status-completed-text';
        case 'closed':
          return 'border-status-closed-border bg-status-closed-bg text-status-closed-text';
        case 'cancelled':
          return 'border-status-cancelled-border bg-status-cancelled-bg text-status-cancelled-text';
        default:
          return 'border-status-new-border bg-status-new-bg text-status-new-text';
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
