import React from 'react';
import { COMPONENT_REGISTRY } from '../registry/component-registry';

export interface DSBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
}

export const DSBottomNavigation: React.FC<DSBottomNavigationProps> & {
  metadata: typeof COMPONENT_REGISTRY.DSBottomNavigation;
} = ({ activeTab, onTabChange, notificationCount }) => {
  const tabs = [
    {
      id: 'calls',
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
      id: 'today',
      label: 'Aujourd\'hui',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    },
    {
      id: 'machines',
      label: 'Machines',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Alertes',
      icon: (
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.003 6.003 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {notificationCount && notificationCount > 0 ? (
            <span 
              className="absolute -top-1.5 -right-1.5 min-h-[18px] min-w-[18px] rounded-full bg-[var(--status-blocked)] text-white text-[9px] font-bold flex items-center justify-center border border-[var(--card-bg)] px-1"
              aria-label={`${notificationCount} alertes non lues`}
            >
              {notificationCount}
            </span>
          ) : null}
        </div>
      )
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      )
    }
  ];

  return (
    <nav
      data-welo-component="DSBottomNavigation"
      className="fixed bottom-0 left-0 right-0 z-[100] h-16 bg-[var(--card-bg)] border-t border-[var(--card-border)] flex items-center justify-around px-2 pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      role="navigation"
      aria-label="Navigation principale mobile du technicien"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full min-h-[48px] min-w-[48px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
              isActive ? 'text-[var(--primary)] font-semibold' : 'text-[var(--foreground)]/50 hover:text-[var(--foreground)]/80'
            }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={tab.label}
          >
            <div className="flex items-center justify-center">{tab.icon}</div>
            <span className="text-[10px] tracking-tight font-medium font-sans mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

DSBottomNavigation.metadata = COMPONENT_REGISTRY.DSBottomNavigation;
export default DSBottomNavigation;
