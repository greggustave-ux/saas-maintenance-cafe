import React from "react";
import DSCard from "@/src/design-system/components/DSCard";

export default function TechnicianMissionsPage() {
  return (
    <div className="space-y-4">
      {/* Search Bar Placeholder */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--foreground)]/45">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          disabled
          type="text"
          className="w-full min-h-[48px] rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 pl-11 text-base text-[var(--foreground)] opacity-70 cursor-not-allowed placeholder-[var(--foreground)]/35"
          placeholder="Rechercher une mission (Bientôt disponible)"
        />
      </div>

      {/* Main Preview Container */}
      <DSCard variant="default" padding="md" className="space-y-4 text-center py-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-[var(--primary)]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--foreground)]">Mobile Foundation Preview</h3>
          <p className="text-sm text-[var(--foreground)]/60 max-w-xs mx-auto">
            Aucun appel de service en cours d&apos;affichage. Cette route est configurée en mode prévisualisation statique.
          </p>
        </div>
      </DSCard>

      {/* Static Visual Structure Mockups */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-wider block px-1">
          Aperçu structurel des cartes
        </span>
        
        <DSCard variant="outlined" padding="md" className="space-y-3 opacity-60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <span className="text-xs font-bold font-mono text-indigo-500">REF-0000 (Placeholder)</span>
              <h4 className="text-base font-bold text-[var(--foreground)] mt-0.5">Structure de Mission</h4>
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 shrink-0">
              Moyenne
            </span>
          </div>
          <div className="border-t border-[var(--card-border)] pt-3 text-xs text-[var(--foreground)]/50">
            <p>Adresse de livraison / panne</p>
            <p className="mt-1 font-mono">Code Série Machine : —</p>
          </div>
        </DSCard>
      </div>
    </div>
  );
}
