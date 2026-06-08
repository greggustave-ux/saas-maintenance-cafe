import React from 'react';
import { COMPONENT_REGISTRY } from '../../registry/component-registry';

export interface DSValidationMessageProps extends React.HTMLAttributes<HTMLSpanElement> {
  error?: boolean;
}

export const DSValidationMessage = React.forwardRef<HTMLSpanElement, DSValidationMessageProps>(
  ({ children, error = true, className = '', ...props }, ref) => {
    if (!children) return null;
    return (
      <span
        ref={ref}
        data-welo-component="DSValidationMessage"
        className={`text-[var(--font-size-sm)] font-medium ${
          error ? 'text-red-500' : 'text-[var(--foreground)]/60'
        } ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

DSValidationMessage.displayName = 'DSValidationMessage';

// Typecast to attach metadata
(DSValidationMessage as any).metadata = COMPONENT_REGISTRY.DSValidationMessage;

export default DSValidationMessage;
