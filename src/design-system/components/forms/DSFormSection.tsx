import React from 'react';
import { COMPONENT_REGISTRY } from '../../registry/component-registry';

export interface DSFormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const DSFormSection = React.forwardRef<HTMLDivElement, DSFormSectionProps>(
  ({ children, title, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-welo-component="DSFormSection"
        className={`w-full space-y-[var(--space-md)] rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-[var(--space-md)] shadow-[var(--shadow-sm)] ${className}`}
        {...props}
      >
        {title && (
          <h3 className="text-[var(--font-size-md)] font-bold text-[var(--foreground)] border-b border-[var(--card-border)] pb-[var(--space-sm)]">
            {title}
          </h3>
        )}
        <div className="space-y-[var(--space-md)]">
          {children}
        </div>
      </div>
    );
  }
);

DSFormSection.displayName = 'DSFormSection';

// Typecast to attach metadata
(DSFormSection as any).metadata = COMPONENT_REGISTRY.DSFormSection;

export default DSFormSection;
