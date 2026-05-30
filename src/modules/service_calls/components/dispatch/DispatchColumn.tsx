"use client";

import { ServiceCall } from "../../types";
import DispatchCard from "./DispatchCard";
import { statusColors, statusLabels } from "./constants";

interface DispatchColumnProps {
    status: string;
    calls: ServiceCall[];
    updateStatus: (id: number, status: string) => Promise<void>;
    updatePriority: (id: number, priority: string) => Promise<void>;
    updateTechnician: (id: number, technicianName: string) => Promise<void>;
    technicians: { id: string; full_name: string }[];
}

export default function DispatchColumn({
    status,
    calls,
    updateStatus,
    updatePriority,
    updateTechnician,
    technicians,
}: DispatchColumnProps) {
    const label = statusLabels[status] || status;
    const colorClass = statusColors[status] || "bg-slate-100 text-slate-700";

    return (
        <div className="flex flex-col w-[290px] sm:w-[310px] md:w-full shrink-0 snap-align-start bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-3 sm:p-4 space-y-4 max-h-[80vh] sm:max-h-[75vh] md:max-h-none overflow-hidden">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-150 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${
                        status === "new" ? "bg-sky-500" :
                        status === "assigned" ? "bg-indigo-500" :
                        status === "on_the_way" ? "bg-amber-500" :
                        status === "on_site" ? "bg-blue-500" :
                        status === "waiting_parts" ? "bg-purple-500" :
                        status === "completed" ? "bg-emerald-500" : "bg-slate-400"
                    }`} />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                        {label}
                    </h3>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-650 dark:text-slate-400 font-mono shrink-0">
                    {calls.length}
                </span>
            </div>

            {/* Cards List container - Scrollable vertically */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {calls.length === 0 ? (
                    <div className="py-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800/70">
                        <p className="text-xs text-slate-400 dark:text-slate-500">Aucun appel</p>
                    </div>
                ) : (
                    calls.map((call) => (
                        <DispatchCard
                            key={call.id}
                            call={call}
                            updateStatus={updateStatus}
                            updatePriority={updatePriority}
                            updateTechnician={updateTechnician}
                            technicians={technicians}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
