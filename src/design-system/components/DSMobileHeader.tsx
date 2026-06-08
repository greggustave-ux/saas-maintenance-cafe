import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export interface DSMobileHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const DSMobileHeader: React.FC<DSMobileHeaderProps> & {
  metadata: typeof COMPONENT_REGISTRY.DSMobileHeader;
} = ({ title, onBack, rightElement }) => {
  return (
    <header
      data-welo-component="DSMobileHeader"
      className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur-md px-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl text-[var(--foreground)]/70 hover:bg-[var(--foreground)]/5 active:scale-95 transition-all cursor-pointer mr-1 shrink-0"
            aria-label="Retour"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="h-2 w-2 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 mr-2 shrink-0" />
        )}
        <h1 className="text-lg font-bold tracking-tight text-[var(--foreground)] truncate font-sans">
          {title}
        </h1>
      </div>

      {rightElement ? (
        <div className="flex items-center justify-end shrink-0 ml-4">
          {rightElement}
        </div>
      ) : null}
    </header>
  );
};

DSMobileHeader.metadata = COMPONENT_REGISTRY.DSMobileHeader;
export default DSMobileHeader;
