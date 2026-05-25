"use client";

import { ServiceCall } from "../types";

interface MachineHistorySectionProps {
    machineHistory: ServiceCall[];
    currentCallId: number;
    machineHistoryLoading: boolean;
}

function getStatusBadgeClass(status: string) {
    switch (status) {
        case "En attente":
            return "bg-amber-50/70 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-250/20";
        case "En cours":
            return "bg-blue-50/70 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-250/20";
        case "Terminé":
            return "bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-250/20";
        default:
            return "bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200/20";
    }
}

export default function MachineHistorySection({
    machineHistory,
    currentCallId,
    machineHistoryLoading,
}: MachineHistorySectionProps) {
    // Filter out the current intervention so we only show the history list
    const otherInterventions = machineHistory.filter((item) => item.id !== currentCallId);

    return (
        <section className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6 space-y-4">
            <div className="flex flex-col gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                        Historique de la machine
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-cyan-50 dark:bg-cyan-950/30 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:text-cyan-400 border border-cyan-200/25">
                        {otherInterventions.length} précédente(s)
                    </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Suivi des interventions sur ce numéro de série
                </p>
            </div>

            {machineHistoryLoading ? (
                <div className="space-y-4 animate-pulse pt-2">
                    <div className="flex gap-4">
                        <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-32 bg-slate-250 dark:bg-slate-750 rounded" />
                            <div className="h-3 w-full bg-slate-150 dark:bg-slate-850 rounded" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-28 bg-slate-250 dark:bg-slate-750 rounded" />
                            <div className="h-3 w-5/6 bg-slate-150 dark:bg-slate-850 rounded" />
                        </div>
                    </div>
                </div>
            ) : otherInterventions.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Aucune autre intervention enregistrée pour cette machine.
                </div>
            ) : (
                <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-5 space-y-6 pt-2 max-h-[350px] overflow-y-auto pr-2">
                    {otherInterventions.map((item) => {
                        const dateStr = item.created_at
                            ? new Date(item.created_at).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                              })
                            : `Intervention #${item.id}`;

                        return (
                            <div key={item.id} className="relative group">
                                {/* Timeline Bullet dot */}
                                <div className="absolute -left-[26px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-cyan-500 dark:bg-cyan-400 group-hover:scale-125 transition-transform" />

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {dateStr}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeClass(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <a
                                            href={`/dashboard/service-calls/${item.id}`}
                                            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5 min-h-8 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850/80 active:scale-98 transition-all shadow-xs border border-slate-200/20"
                                        >
                                            Consulter
                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>

                                    <div className="text-xs text-slate-550 dark:text-slate-400">
                                        Technicien : <span className="font-medium text-slate-800 dark:text-slate-300">{item.technician_name || "Non assigné"}</span>
                                    </div>

                                    {/* Issue / Notes preview */}
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-850/40 p-2.5 border border-slate-200/10 text-xs text-slate-600 dark:text-slate-355 leading-relaxed max-w-full truncate break-words">
                                        <p className="font-semibold text-[9px] uppercase text-slate-450 tracking-wider mb-0.5">Notes de clôture / Description</p>
                                        <p className="line-clamp-2">
                                            {item.technician_notes || item.issue_description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
