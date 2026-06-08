import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export type SyncState = 'synced' | 'syncing' | 'offline';

export interface OfflineSyncIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  state: SyncState;
  queuedCount: number;
}

export const OfflineSyncIndicator: React.FC<OfflineSyncIndicatorProps> & {
  metadata: typeof COMPONENT_REGISTRY.OfflineSyncIndicator;
} = ({ state, queuedCount, className = '', ...props }) => {
  const getBannerStyles = () => {
    switch (state) {
      case 'offline':
        return 'bg-[var(--status-blocked)] text-white';
      case 'syncing':
        return 'bg-[var(--status-pending)] text-[var(--foreground)]';
      case 'synced':
      default:
        return 'bg-[var(--status-completed)] text-white';
    }
  };

  const getLabel = () => {
    switch (state) {
      case 'offline':
        return `Hors ligne - ${queuedCount} action(s) en attente`;
      case 'syncing':
        return 'Synchronisation en cours...';
      case 'synced':
      default:
        return 'Modifications synchronisées';
    }
  };

  return (
    <div
      data-welo-component="OfflineSyncIndicator"
      className={`fixed top-4 right-4 z-[2000] flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg animate-fade-in ${getBannerStyles()} ${className}`}
      role="status"
      aria-live="polite"
      {...props}
    >
      {state === 'syncing' && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {state === 'offline' && (
        <svg
          className="h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-3.536 4.978 4.978 0 011.414-3.536M3 3l18 18"
          />
        </svg>
      )}
      {state === 'synced' && (
        <svg
          className="h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span>{getLabel()}</span>
    </div>
  );
};

OfflineSyncIndicator.metadata = COMPONENT_REGISTRY.OfflineSyncIndicator;
export default OfflineSyncIndicator;
