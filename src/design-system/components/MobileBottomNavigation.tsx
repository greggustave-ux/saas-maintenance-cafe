import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export interface MobileBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> & {
  metadata: typeof COMPONENT_REGISTRY.MobileBottomNavigation;
} = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'jobs',
      label: 'Missions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      )
    },
    {
      id: 'history',
      label: 'Historique',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )
    },
    {
      id: 'inventory',
      label: 'Stock',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      )
    }
  ];

  return (
    <nav
      data-welo-component="MobileBottomNavigation"
      className="fixed bottom-0 left-0 right-0 z-[100] h-16 bg-[var(--card-bg)] border-t border-[var(--card-border)] flex items-center justify-around px-4 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
      role="navigation"
      aria-label="Navigation principale mobile"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] min-w-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
              isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]/80'
            }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="text-[10px] font-medium font-sans mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

MobileBottomNavigation.metadata = COMPONENT_REGISTRY.MobileBottomNavigation;
export default MobileBottomNavigation;
