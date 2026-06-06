import React from 'react';
import { COMPONENT_REGISTRY } from '../../registry/component-registry';

export interface DSTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  loading?: boolean;
}

export const DSTextarea = React.forwardRef<HTMLTextAreaElement, DSTextareaProps>(
  ({ className = '', error, loading, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled || loading}
        data-welo-component="DSTextarea"
        className={`w-full min-h-[100px] rounded-[var(--radius-md)] border bg-[var(--card-bg)] px-4 py-3 text-[var(--font-size-base)] text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 transition-all duration-[var(--transition-normal)] focus:ring-0 focus:outline-none resize-y [color-scheme:light_dark] disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-red-500 focus:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
            : 'border-[var(--card-border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(34,211,238,0.15)]'
        } ${className}`}
        {...props}
      />
    );
  }
);

DSTextarea.displayName = 'DSTextarea';

// Typecast to attach metadata
(DSTextarea as any).metadata = COMPONENT_REGISTRY.DSTextarea;

export default DSTextarea;
