import React from "react";
import DSCard from "@/src/design-system/components/DSCard";

export default function TechnicianTodayPage() {
  return (
    <div className="space-y-4">
      <DSCard variant="default" padding="md" className="space-y-4 text-center py-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-[var(--primary)]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--foreground)]">Mobile Foundation Preview</h3>
          <p className="text-sm text-[var(--foreground)]/60 max-w-xs mx-auto">
            Aperçu de la planification quotidienne. Cette fonctionnalité de calendrier est en attente d&apos;implémentation logique.
          </p>
        </div>
      </DSCard>
    </div>
  );
}
