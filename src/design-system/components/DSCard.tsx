import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export type DSCardVariant = 'default' | 'flat' | 'outlined';
export type DSCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface DSCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DSCardVariant;
  padding?: DSCardPadding;
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const DSCard: React.FC<DSCardProps> & { metadata: typeof COMPONENT_REGISTRY.DSCard } = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return 'p-0';
      case 'sm':
        return 'p-[var(--space-sm,0.5rem)]';
      case 'md':
        return 'p-[var(--space-md,1rem)]';
      case 'lg':
        return 'p-[var(--space-lg,1.5rem)]';
      default:
        return 'p-[var(--space-md,1rem)]';
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'flat':
        return 'bg-slate-50/20 dark:bg-slate-950/20 border border-slate-200/80 dark:border-slate-800/80';
      case 'outlined':
        return 'bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80';
      case 'default':
      default:
        return 'bg-[var(--card-bg,white)] border border-[var(--card-border,rgba(15,23,42,0.08))] shadow-[var(--shadow-sm,0_1px_2px_0_rgba(0,0,0,0.05))]';
    }
  };

  const getHoverClass = () => {
    if (!hoverable) return '';
    return 'transition-all duration-[var(--transition-normal,150ms)] hover:shadow-[var(--shadow-md,0_4px_6px_-1px_rgba(0,0,0,0.1))] hover:border-[var(--foreground,black)]/15';
  };

  return (
    <div
      data-welo-component="DSCard"
      className={`rounded-[var(--radius-lg,1rem)] font-sans overflow-hidden ${getVariantClass()} ${getPaddingClass()} ${getHoverClass()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

DSCard.metadata = COMPONENT_REGISTRY.DSCard;
export default DSCard;
