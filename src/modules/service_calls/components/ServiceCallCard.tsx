"use client";

import React from 'react';
import { ServiceCall } from "../types";
import { priorityLabels } from "./dispatch/constants";
import { PriorityBadge } from "@/src/design-system/components/PriorityBadge";
import { StatusBadge } from "@/src/design-system/components/StatusBadge";
import { COMPONENT_REGISTRY } from "@/src/design-system/registry/component-registry";

interface ServiceCallCardProps {
    call: ServiceCall;
    updateStatus: (id: number, status: string) => Promise<void>;
    deleteCall: (id: number) => Promise<void>;
    getStatusColor: (status: string) => string;
    archiveCall?: (id: number, archived: boolean) => Promise<void>;
    userRole?: string | null;
}

export const ServiceCallCard: React.FC<ServiceCallCardProps> & {
    metadata: typeof COMPONENT_REGISTRY.ServiceCallCard;
} = ({
    call,
    updateStatus,
    deleteCall,
    getStatusColor,
    archiveCall,
    userRole,
}) => {
    // Safety Fallbacks
    const safePriority = call.priority || 'medium';
    const safeStatus = call.status || 'new';

    return (
        <article 
            data-welo-component="ServiceCallCard"
            className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-[var(--space-md)] shadow-[var(--shadow-sm)] transition-all duration-[var(--transition-normal)] hover:shadow-[var(--shadow-md)] hover:border-[var(--foreground)]/15 font-sans"
        >
            <div className="space-y-[var(--space-sm)]">
                <div className="flex items-start justify-between gap-[var(--space-sm)]">
                    <div className="flex flex-col gap-[var(--space-xs)] min-w-0">
                        <div className="flex items-center gap-[var(--space-xs)] flex-wrap">
                            {call.reference_number && (
                                <span className="text-[var(--font-size-sm)] font-bold font-mono tracking-wider text-[var(--primary)] uppercase">
                                    {call.reference_number}
                                </span>
                            )}
                            <PriorityBadge priority={safePriority} className="text-[9px]" />
                        </div>
                        <a
                            href={`/dashboard/service-calls/${call.id}`}
                            className="text-[var(--font-size-md)] font-bold tracking-tight text-[var(--foreground)] hover:text-[var(--primary)] transition-colors leading-snug break-words"
                        >
                            {call.client_name}
                        </a>
                    </div>
                    
                    {/* Status selector (touch-target compliant) */}
                    <div className="shrink-0">
                        <select
                            value={safeStatus}
                            onChange={(e) => updateStatus(call.id, e.target.value)}
                            aria-label={`Statut pour ${call.client_name}`}
                            className={`min-h-[var(--touch-target-min)] rounded-[var(--radius-md)] px-2.5 py-1 text-[var(--font-size-sm)] font-semibold ${getStatusColor(safeStatus)} cursor-pointer focus:ring-0 bg-[var(--card-bg)] border border-[var(--card-border)] [color-scheme:light_dark]`}
                        >
                            <option value="new">Nouveau</option>
                            <option value="assigned">Assigné</option>
                            <option value="on_the_way">En route</option>
                            <option value="on_site">Sur place</option>
                            <option value="waiting_parts">En attente de pièces</option>
                            <option value="completed">Terminé</option>
                            <option value="closed">Clos</option>
                            <option value="cancelled">Annulé</option>
                        </select>
                    </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-[var(--space-md)] gap-y-[var(--space-sm)] border-t border-[var(--card-border)] pt-[var(--space-md)] text-[var(--font-size-base)]">
                    <div className="col-span-2">
                        <dt className="text-[var(--font-size-sm)] font-semibold uppercase tracking-wider text-[var(--foreground)]/40">
                            Adresse
                        </dt>
                        <dd className="mt-0.5 font-medium text-[var(--foreground)]/80 break-words leading-relaxed">
                            {call.address}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-[var(--font-size-sm)] font-semibold uppercase tracking-wider text-[var(--foreground)]/40">
                            N° série machine
                        </dt>
                        <dd className="mt-0.5 font-medium text-[var(--foreground)]/80 break-all">
                            {call.machine_serial || "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-[var(--font-size-sm)] font-semibold uppercase tracking-wider text-[var(--foreground)]/40">
                            Technicien
                        </dt>
                        <dd className="mt-0.5 font-medium text-[var(--foreground)]/80">
                            {call.technician_name || "Non assigné"}
                        </dd>
                    </div>
                    <div className="col-span-2">
                        <dt className="text-[var(--font-size-sm)] font-semibold uppercase tracking-wider text-[var(--foreground)]/40">
                            Problème
                        </dt>
                        <dd className="mt-0.5 text-[var(--foreground)]/70 line-clamp-2 leading-relaxed">
                            {call.issue_description}
                        </dd>
                    </div>
                </dl>
            </div>

            {/* Bottom Actions section (touch-target compliant) */}
            <div className="mt-[var(--space-md)] flex gap-[var(--space-sm)] border-t border-[var(--card-border)] pt-[var(--space-md)]">
                <a
                    href={`/dashboard/service-calls/${call.id}`}
                    className="flex-1 flex min-h-[var(--touch-target-min)] items-center justify-center rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] border border-[var(--card-border)] text-[var(--font-size-base)] font-semibold hover:bg-[var(--foreground)]/5 active:scale-98 transition-all"
                >
                    Ouvrir la fiche
                </a>
                
                {archiveCall && userRole && (userRole === "admin" || userRole === "dispatcher") && (
                    call.archived ? (
                        <button
                            type="button"
                            onClick={() => archiveCall(call.id, false)}
                            className="flex-1 flex min-h-[var(--touch-target-min)] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[var(--font-size-base)] font-semibold hover:bg-amber-500/15 active:scale-98 transition-all cursor-pointer"
                        >
                            Désarchiver
                        </button>
                    ) : (
                        (safeStatus === "completed" || safeStatus === "closed") && (
                            <button
                                type="button"
                                onClick={() => archiveCall(call.id, true)}
                                className="flex-1 flex min-h-[var(--touch-target-min)] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[var(--font-size-base)] font-semibold hover:bg-amber-500/15 active:scale-98 transition-all cursor-pointer"
                            >
                                Archiver
                            </button>
                        )
                    )
                )}

                <button
                    type="button"
                    onClick={() => deleteCall(call.id)}
                    className="flex min-h-[var(--touch-target-min)] min-w-[var(--touch-target-min)] items-center justify-center rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/15 active:scale-95 transition-all cursor-pointer"
                    aria-label="Supprimer l'appel"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </article>
    );
};

export function ServiceCallCardSkeleton() {
    return (
        <div className="flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-[var(--space-md)] shadow-[var(--shadow-sm)] animate-pulse">
            <div className="space-y-[var(--space-sm)]">
                <div className="flex items-start justify-between gap-[var(--space-sm)]">
                    <div className="h-6 w-1/2 rounded-[var(--radius-sm)] bg-[var(--foreground)]/10" />
                    <div className="h-7 w-20 rounded-[var(--radius-md)] bg-[var(--foreground)]/5" />
                </div>

                <div className="space-y-[var(--space-sm)] border-t border-[var(--card-border)] pt-[var(--space-md)]">
                    <div>
                        <div className="h-3 w-16 rounded bg-[var(--foreground)]/10" />
                        <div className="mt-2 h-4 w-3/4 rounded bg-[var(--foreground)]/5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="h-3 w-20 rounded bg-[var(--foreground)]/10" />
                            <div className="mt-2 h-4 w-24 rounded bg-[var(--foreground)]/5" />
                        </div>
                        <div>
                            <div className="h-3 w-16 rounded bg-[var(--foreground)]/10" />
                            <div className="mt-2 h-4 w-20 rounded bg-[var(--foreground)]/5" />
                        </div>
                    </div>
                    <div>
                        <div className="h-3 w-16 rounded bg-[var(--foreground)]/10" />
                        <div className="mt-2 h-4 w-5/6 rounded bg-[var(--foreground)]/5" />
                    </div>
                </div>
            </div>

            <div className="mt-[var(--space-md)] flex gap-[var(--space-sm)] border-t border-[var(--card-border)] pt-[var(--space-md)]">
                <div className="h-11 flex-1 rounded-[var(--radius-md)] bg-[var(--foreground)]/5" />
                <div className="h-11 w-11 rounded-[var(--radius-md)] bg-red-500/5" />
            </div>
        </div>
    );
}

// Add component mapping to registry metadata
ServiceCallCard.metadata = {
    componentId: 'ServiceCallCard',
    version: '1.0.0',
    lifecycleStage: 'production-approved',
    figmaNodeMapping: 'figma.com/file/welo-ui?node-id=201:10',
    syncRiskLevel: 'medium',
    auditTags: ['Mobile/List', 'InterTypography', 'TouchTarget44'],
};

export default ServiceCallCard;
