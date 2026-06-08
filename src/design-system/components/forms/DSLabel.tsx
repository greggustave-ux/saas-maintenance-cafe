import React from 'react';
import { COMPONENT_REGISTRY } from '../../registry/component-registry';

export interface DSLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const DSLabel = React.forwardRef<HTMLLabelElement, DSLabelProps>(
  ({ children, required, className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        data-welo-component="DSLabel"
        className={`text-[var(--font-size-sm)] font-semibold uppercase tracking-wider text-[var(--foreground)]/45 select-none ${className}`}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  }
);

DSLabel.displayName = 'DSLabel';

// Typecast to attach metadata
(DSLabel as any).metadata = COMPONENT_REGISTRY.DSLabel;

export default DSLabel;
