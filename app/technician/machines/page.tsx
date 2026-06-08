import React from "react";
import DSCard from "@/src/design-system/components/DSCard";

export default function TechnicianMachinesPage() {
  return (
    <div className="space-y-4">
      <DSCard variant="default" padding="md" className="space-y-4 text-center py-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-[var(--primary)]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--foreground)]">Mobile Foundation Preview</h3>
          <p className="text-sm text-[var(--foreground)]/60 max-w-xs mx-auto">
            Aperçu de la consultation du parc machines. Cette fonctionnalité est en attente d&apos;implémentation.
          </p>
        </div>
      </DSCard>
    </div>
  );
}
