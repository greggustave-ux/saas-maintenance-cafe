import React from "react";
import DSCard from "@/src/design-system/components/DSCard";

export default function TechnicianProfilePage() {
  return (
    <div className="space-y-4">
      <DSCard variant="default" padding="md" className="space-y-4 text-center py-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-[var(--primary)]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--foreground)]">Mobile Foundation Preview</h3>
          <p className="text-sm text-[var(--foreground)]/60 max-w-xs mx-auto">
            Aperçu des paramètres du profil et d&apos;activité du technicien. Cette fonctionnalité est en attente d&apos;implémentation.
          </p>
        </div>
      </DSCard>
    </div>
  );
}
