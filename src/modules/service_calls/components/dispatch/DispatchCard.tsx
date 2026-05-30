"use client";

import { ServiceCall } from "../../types";
import { statusColors, statusLabels, priorityColors, priorityLabels } from "./constants";

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

export default function DispatchCard({
    call,
    updateStatus,
    updatePriority,
    updateTechnician,
    technicians,
    archiveCall,
    userRole,
}: DispatchCardProps) {
    const age = getCallAge(call.created_at);

    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800/85 bg-white dark:bg-slate-900 p-4.5 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-750 transition-all duration-200">
            {/* Top row: Reference and Age */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold font-mono tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">
                    {call.reference_number || `CALL-${call.id}`}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Il y a {age}
                </span>
            </div>

            {/* Client Name */}
            <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                {call.client_name}
            </h4>

            {/* Issue Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {call.issue_description}
            </p>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3.5 mt-3.5 text-[11px] font-semibold">
                <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Machine</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block uppercase tracking-wide font-mono">
                        {call.machine_serial || "—"}
                    </span>
                </div>
                <div>
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Technicien</span>
                    <select
                        value={call.technician_name || ""}
                        onChange={(e) => updateTechnician(call.id, e.target.value)}
                        className="w-full text-slate-700 dark:text-slate-300 truncate block bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 border-0 focus:ring-0 p-0 text-[11px] font-semibold cursor-pointer outline-none [color-scheme:light_dark]"
                    >
                        <option value="" className="text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-semibold">Non assigné</option>
                        {technicians.map((tech) => (
                            <option key={tech.id} value={tech.full_name} className="text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-semibold">
                                {tech.full_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Interactive Selectors and Badges */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Statut</label>
                    <select
                        value={call.status}
                        onChange={(e) => updateStatus(call.id, e.target.value)}
                        className={`w-full min-h-8 rounded-lg px-2 py-0.5 text-[11px] font-bold ${statusColors[call.status] || ""} cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-0`}
                    >
                        {Object.entries(statusLabels).map(([val, label]) => (
                            <option key={val} value={val} className="text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-semibold">
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Priorité</label>
                    <select
                        value={call.priority || "medium"}
                        onChange={(e) => updatePriority(call.id, e.target.value)}
                        className={`w-full min-h-8 rounded-lg px-2 py-0.5 text-[11px] font-bold ${priorityColors[call.priority || "medium"] || ""} cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-0`}
                    >
                        {Object.entries(priorityLabels).map(([val, label]) => (
                            <option key={val} value={val} className="text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-semibold">
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bottom row: Card Actions */}
            <div className="mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-800/40 flex gap-2">
                <a
                    href={`/dashboard/service-calls/${call.id}`}
                    className="flex-1 flex min-h-8.5 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-colors shadow-3xs"
                >
                    Ouvrir la fiche
                </a>
                {userRole && (userRole === "admin" || userRole === "dispatcher") && (call.status === "completed" || call.status === "closed") && !call.archived && (
                    <button
                        type="button"
                        onClick={() => archiveCall(call.id, true)}
                        className="flex-1 flex min-h-8.5 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-955/20 border border-amber-200/50 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-950/30 text-[11px] font-bold text-amber-700 dark:text-amber-400 transition-colors shadow-3xs cursor-pointer"
                    >
                        Archiver
                    </button>
                )}
            </div>
        </article>
    );
}
