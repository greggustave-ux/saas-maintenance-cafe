"use client";

import { useState, useMemo } from "react";
import { ServiceCall } from "../../types";
import DispatchColumn from "./DispatchColumn";
import { KANBAN_COLUMNS } from "./constants";

interface DispatchBoardProps {
    serviceCalls: ServiceCall[];
    updateStatus: (id: number, status: string) => Promise<void>;
    updatePriority: (id: number, priority: string) => Promise<void>;
    updateTechnician: (id: number, technicianName: string) => Promise<void>;
    technicians: { id: string; full_name: string }[];
}

const inputClass =
    "w-full min-h-11 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

export default function DispatchBoard({
    serviceCalls,
    updateStatus,
    updatePriority,
    updateTechnician,
    technicians,
}: DispatchBoardProps) {
    const [search, setSearch] = useState("");

    // Filter service calls locally based on search query
    const filteredCalls = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (!term) return serviceCalls;

        return serviceCalls.filter((call) =>
            call.client_name.toLowerCase().includes(term) ||
            (call.machine_serial && call.machine_serial.toLowerCase().includes(term)) ||
            (call.technician_name && call.technician_name.toLowerCase().includes(term)) ||
            (call.reference_number && call.reference_number.toLowerCase().includes(term))
        );
    }, [serviceCalls, search]);

    // Group filtered calls by status
    const callsByStatus = useMemo(() => {
        const groups: Record<string, ServiceCall[]> = {};
        KANBAN_COLUMNS.forEach((status) => {
            groups[status] = [];
        });

        filteredCalls.forEach((call) => {
            const status = call.status;
            if (groups[status]) {
                groups[status].push(call);
            }
        });

        return groups;
    }, [filteredCalls]);

    return (
        <div className="space-y-5 w-full">
            {/* Quick search input */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    className={`${inputClass} pl-10`}
                    placeholder="Filtrer par référence, client, machine, tech..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Kanban Columns Wrapper - Horizontal scroll on mobile, Grid on desktop */}
            <div className="w-full overflow-x-auto flex flex-nowrap sm:flex-nowrap md:grid md:grid-cols-3 xl:grid-cols-6 gap-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {KANBAN_COLUMNS.map((status) => (
                    <DispatchColumn
                        key={status}
                        status={status}
                        calls={callsByStatus[status] || []}
                        updateStatus={updateStatus}
                        updatePriority={updatePriority}
                        updateTechnician={updateTechnician}
                        technicians={technicians}
                    />
                ))}
            </div>
        </div>
    );
}
