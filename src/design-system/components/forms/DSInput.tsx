import React from 'react';
import { COMPONENT_REGISTRY } from '../../registry/component-registry';

export interface DSInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  loading?: boolean;
}

export const DSInput = React.forwardRef<HTMLInputElement, DSInputProps>(
  ({ className = '', error, loading, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          disabled={disabled || loading}
          data-welo-component="DSInput"
          className={`w-full min-h-[var(--touch-target-min)] rounded-[var(--radius-md)] border bg-[var(--card-bg)] px-4 py-3 text-[var(--font-size-base)] text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 transition-all duration-[var(--transition-normal)] focus:ring-0 focus:outline-none [color-scheme:light_dark] disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-red-500 focus:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]'
              : 'border-[var(--card-border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(34,211,238,0.15)]'
          } ${className}`}
          {...props}
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <svg className="animate-spin h-5 w-5 text-[var(--foreground)]/40" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>
    );
  }
);

DSInput.displayName = 'DSInput';

// Typecast to attach metadata
(DSInput as any).metadata = COMPONENT_REGISTRY.DSInput;

export default DSInput;
