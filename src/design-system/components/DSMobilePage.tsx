import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export interface DSMobilePageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  bottomNav?: React.ReactNode;
}

export const DSMobilePage: React.FC<DSMobilePageProps> & {
  metadata: typeof COMPONENT_REGISTRY.DSMobilePage;
} = ({ children, header, bottomNav, className = '', ...props }) => {
  return (
    <div
      data-welo-component="DSMobilePage"
      className="relative flex flex-col min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden"
      {...props}
    >
      {/* Header Slot */}
      {header ? <div className="shrink-0">{header}</div> : null}

      {/* Main Content Area */}
      <main 
        className={`flex-1 min-w-0 w-full overflow-y-auto px-4 py-5 pb-24 ${className}`}
        style={{
          // Extra bottom padding override to clear any fixed iOS bottom nav heights and physical home bars
          paddingBottom: bottomNav ? 'calc(5rem + env(safe-area-inset-bottom, 16px))' : '1.25rem'
        }}
      >
        {children}
      </main>

      {/* Sticky Bottom Navigation Slot */}
      {bottomNav ? <div className="shrink-0">{bottomNav}</div> : null}
    </div>
  );
};

DSMobilePage.metadata = COMPONENT_REGISTRY.DSMobilePage;
export default DSMobilePage;
