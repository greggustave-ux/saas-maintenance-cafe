"use client";

import React from 'react';
import { ServiceCall } from "../../types";
import { statusColors, statusLabels, priorityColors, priorityLabels } from "./constants";
import { PriorityBadge } from "@/src/design-system/components/PriorityBadge";
import { StatusBadge } from "@/src/design-system/components/StatusBadge";
import { COMPONENT_REGISTRY } from "@/src/design-system/registry/component-registry";

interface DispatchCardProps {
    call: ServiceCall;
    updateStatus: (id: number, status: string) => Promise<void>;
    updatePriority: (id: number, priority: string) => Promise<void>;
    updateTechnician: (id: number, technicianName: string) => Promise<void>;
    technicians: { id: string; full_name: string }[];
    archiveCall: (id: number, archived: boolean) => Promise<void>;
    userRole: string | null;
}

export function getCallAge(createdAt?: string): string {
    if (!createdAt) return "—";
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    if (diffMs < 0) return "0m";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}j`;
}

export const DispatchCard: React.FC<DispatchCardProps> & {
    metadata: typeof COMPONENT_REGISTRY.DispatchKanbanCard;
} = ({
    call,
    updateStatus,
    updatePriority,
    updateTechnician,
    technicians,
    archiveCall,
    userRole,
}) => {
    const age = getCallAge(call.created_at);
    const safeStatus = call.status || "new";
    const safePriority = call.priority || "medium";
    const safeClient = call.client_name || "Client inconnu";
    const safeAddress = call.address || "Adresse non fournie";
    const safeMachine = call.machine_serial || "—";
    const safeTechnician = call.technician_name || "Non assigné";
    const safeIssue = call.issue_description || "Aucune description";

    return (
        <article 
            data-welo-component="DispatchKanbanCard"
            className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card-bg)] p-[var(--space-md)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[var(--foreground)]/15 transition-all duration-[var(--transition-normal)] font-sans"
        >
            {/* Top row: Reference and Age, with design system PriorityBadge & StatusBadge */}
            <div className="flex items-center justify-between gap-[var(--space-sm)] mb-[var(--space-xs)] flex-wrap">
                <div className="flex items-center gap-[var(--space-xs)] flex-wrap min-w-0">
                    <span className="text-[var(--font-size-sm)] font-bold font-mono tracking-wider text-[var(--primary)] uppercase truncate">
                        {call.reference_number || `CALL-${call.id}`}
                    </span>
                    <PriorityBadge priority={safePriority} className="text-[9px]" />
                    <StatusBadge status={safeStatus} className="text-[9px]" />
                </div>
                <span className="text-[var(--font-size-sm)] font-semibold text-[var(--foreground)]/50 inline-flex items-center gap-1 shrink-0">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Il y a {age}
                </span>
            </div>

            {/* Client Name */}
            <h4 className="text-[var(--font-size-md)] font-bold text-[var(--foreground)] line-clamp-1 leading-snug break-words">
                {safeClient}
            </h4>

            {/* Issue Description */}
            <p className="text-[var(--font-size-sm)] text-[var(--foreground)]/70 line-clamp-2 mt-[var(--space-xs)] leading-relaxed break-words">
                {safeIssue}
            </p>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-[var(--space-md)] border-t border-[var(--card-border)] pt-[var(--space-md)] mt-[var(--space-md)] text-[var(--font-size-sm)] font-semibold">
                <div className="min-w-0">
                    <span className="block text-[var(--font-size-sm)] uppercase tracking-wider text-[var(--foreground)]/45 mb-0.5">Machine</span>
                    <span className="text-[var(--foreground)]/80 truncate block uppercase tracking-wide font-mono">
                        {safeMachine}
                    </span>
                </div>
                <div className="min-w-0">
                    <span className="block text-[var(--font-size-sm)] uppercase tracking-wider text-[var(--foreground)]/45 mb-0.5">Technicien</span>
                    <select
                        value={call.technician_name || ""}
                        onChange={(e) => updateTechnician(call.id, e.target.value)}
                        aria-label={`Technicien pour ${safeClient}`}
                        className="w-full min-h-[var(--touch-target-min)] text-[var(--foreground)]/80 truncate block bg-[var(--card-bg)] hover:bg-[var(--foreground)]/5 border border-[var(--card-border)] rounded-[var(--radius-md)] px-2.5 py-1 text-[var(--font-size-sm)] font-semibold cursor-pointer outline-none focus:ring-0 [color-scheme:light_dark]"
                    >
                        <option value="" className="text-[var(--foreground)] bg-[var(--card-bg)] font-semibold">Non assigné</option>
                        {technicians.map((tech) => (
                            <option key={tech.id} value={tech.full_name} className="text-[var(--foreground)] bg-[var(--card-bg)] font-semibold">
                                {tech.full_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Interactive Selectors and Badges */}
            <div className="grid grid-cols-2 gap-[var(--space-sm)] mt-[var(--space-md)] pt-[var(--space-md)] border-t border-[var(--card-border)]">
                <div className="flex flex-col gap-[var(--space-xs)]">
                    <label className="text-[var(--font-size-sm)] font-bold uppercase tracking-wider text-[var(--foreground)]/45">Statut</label>
                    <select
                        value={safeStatus}
                        onChange={(e) => updateStatus(call.id, e.target.value)}
                        aria-label={`Statut pour ${safeClient}`}
                        className={`w-full min-h-[var(--touch-target-min)] rounded-[var(--radius-md)] px-2.5 py-1 text-[var(--font-size-sm)] font-bold ${statusColors[safeStatus] || ""} cursor-pointer bg-[var(--card-bg)] border border-[var(--card-border)] focus:ring-0 [color-scheme:light_dark]`}
                    >
                        {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val} className="text-[var(--foreground)] bg-[var(--card-bg)] font-semibold">
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-[var(--space-xs)]">
                    <label className="text-[var(--font-size-sm)] font-bold uppercase tracking-wider text-[var(--foreground)]/45">Priorité</label>
                    <select
                        value={safePriority}
                        onChange={(e) => updatePriority(call.id, e.target.value)}
                        aria-label={`Priorité pour ${safeClient}`}
                        className={`w-full min-h-[var(--touch-target-min)] rounded-[var(--radius-md)] px-2.5 py-1 text-[var(--font-size-sm)] font-bold ${priorityColors[safePriority] || ""} cursor-pointer bg-[var(--card-bg)] border border-[var(--card-border)] focus:ring-0 [color-scheme:light_dark]`}
                    >
                        {Object.entries(priorityLabels).map(([val, label]) => (
                            <option key={val} value={val} className="text-[var(--foreground)] bg-[var(--card-bg)] font-semibold">
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bottom row: Card Actions */}
            <div className="mt-[var(--space-md)] pt-[var(--space-md)] border-t border-[var(--card-border)] flex gap-[var(--space-sm)]">
                <a
                    href={`/dashboard/service-calls/${call.id}`}
                    className="flex-1 flex min-h-[var(--touch-target-min)] items-center justify-center rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] border border-[var(--card-border)] text-[var(--font-size-base)] font-semibold hover:bg-[var(--foreground)]/5 active:scale-98 transition-all"
                >
                    Ouvrir la fiche
                </a>
                {userRole && (userRole === "admin" || userRole === "dispatcher") && (safeStatus === "completed" || safeStatus === "closed") && !call.archived && (
                    <button
                        type="button"
                        onClick={() => archiveCall(call.id, true)}
                        className="flex-1 flex min-h-[var(--touch-target-min)] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[var(--font-size-base)] font-semibold hover:bg-amber-500/15 active:scale-98 transition-all cursor-pointer"
                    >
                        Archiver
                    </button>
                )}
            </div>
        </article>
    );
};

// Add component mapping to registry metadata
DispatchCard.metadata = {
    componentId: 'DispatchKanbanCard',
    version: '1.0.0',
    lifecycleStage: 'production-approved',
    figmaNodeMapping: 'figma.com/file/welo-ui?node-id=201:11',
    syncRiskLevel: 'medium',
    auditTags: ['Desktop/Widget', 'InterTypography', 'TouchTarget44'],
};

export default DispatchCard;
