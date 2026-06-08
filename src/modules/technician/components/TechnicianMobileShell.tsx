"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import DSMobilePage from "@/src/design-system/components/DSMobilePage";
import DSMobileHeader from "@/src/design-system/components/DSMobileHeader";
import DSBottomNavigation from "@/src/design-system/components/DSBottomNavigation";

interface TechnicianMobileShellProps {
  children: React.ReactNode;
}

export default function TechnicianMobileShell({ children }: TechnicianMobileShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Tab routing configuration
  const tabMapping: Record<string, string> = {
    "/technician": "calls",
    "/technician/calls": "calls",
    "/technician/today": "today",
    "/technician/machines": "machines",
    "/technician/notifications": "notifications",
    "/technician/profile": "profile",
  };

  // Find active tab based on path, default to 'calls'
  const currentTab = tabMapping[pathname] || "calls";

  const handleTabChange = (tab: string) => {
    // Navigate safely based on selection
    if (tab === "calls") {
      router.push("/technician");
    } else {
      router.push(`/technician/${tab}`);
    }
  };

  // Determine header title based on active tab
  const getHeaderTitle = () => {
    if (pathname.includes("/calls/")) {
      return "Fiche Intervention";
    }
    
    switch (currentTab) {
      case "today":
        return "Calendrier du Jour";
      case "machines":
        return "Parc Machines";
      case "notifications":
        return "Alertes Operations";
      case "profile":
        return "Mon Profil";
      case "calls":
      default:
        return "Mes Missions";
    }
  };

  // Safe Back button logic
  const handleBack = pathname !== "/technician" && !Object.keys(tabMapping).includes(pathname)
    ? () => router.back()
    : undefined;

  return (
    <DSMobilePage
      header={
        <DSMobileHeader
          title={getHeaderTitle()}
          onBack={handleBack}
          rightElement={
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              En Ligne
            </div>
          }
        />
      }
      bottomNav={
        <DSBottomNavigation
          activeTab={currentTab}
          onTabChange={handleTabChange}
          notificationCount={3} // Demonstration count
        />
      }
    >
      {children}
    </DSMobilePage>
  );
}
