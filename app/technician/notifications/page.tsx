import React from "react";
import DSCard from "@/src/design-system/components/DSCard";

export default function TechnicianNotificationsPage() {
  return (
    <div className="space-y-4">
      <DSCard variant="default" padding="md" className="space-y-4 text-center py-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-[var(--primary)]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.003 6.003 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--foreground)]">Mobile Foundation Preview</h3>
          <p className="text-sm text-[var(--foreground)]/60 max-w-xs mx-auto">
            Aperçu des alertes de dispatch et d&apos;urgence en temps réel. Cette fonctionnalité est en attente d&apos;implémentation.
          </p>
        </div>
      </DSCard>
    </div>
  );
}
