"use client";

import React from "react";
import { useServiceCalls } from "@/src/modules/service_calls/hooks";
import { DSBadge } from "@/src/design-system/components/DSBadge";
import { DSCard } from "@/src/design-system/components/DSCard";

const inputClass =
    "w-full min-h-12 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 pl-11 text-base text-[var(--foreground)] placeholder-[var(--foreground)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20";

export default function TechnicianCallsPage() {
    const {
        search,
        setSearch,
        loading,
        error,
        filteredCalls,
    } = useServiceCalls();

    if (loading) {
        return <TechnicianCallsSkeleton />;
    }

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--foreground)]/45">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className={inputClass}
                    placeholder="Rechercher par client, machine, adresse..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </div>
            )}

            {filteredCalls.length === 0 ? (
                <DSCard variant="default" padding="md" className="py-12 text-center border border-dashed border-[var(--card-border)]">
                    <p className="text-sm text-[var(--foreground)]/50">Aucun appel de service assigné trouvé.</p>
                </DSCard>
            ) : (
                <div className="space-y-3.5">
                    {filteredCalls.map((call) => (
                        <DSCard
                            key={call.id}
                            variant="outlined"
                            padding="none"
                            className="p-4 relative overflow-hidden flex flex-col justify-between"
                        >
                            {/* Left indicator accent strip based on priority */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                                call.priority === "urgent" || call.priority === "high" ? "bg-red-500" : "bg-cyan-500"
                            }`} />

                            <div className="pl-2.5 space-y-3">
                                {/* Header Card row */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-0.5">
                                        {call.reference_number && (
                                            <span className="text-[11px] font-bold font-mono tracking-wider text-[var(--primary)] uppercase">
                                                {call.reference_number}
                                            </span>
                                        )}
                                        <h3 className="text-base font-bold text-[var(--foreground)] leading-tight">
                                            {call.client_name}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <DSBadge category="status" variant={call.status || "new"} className="text-[10px]" />
                                        <DSBadge category="priority" variant={call.priority || "medium"} className="text-[9px]" />
                                    </div>
                                </div>

                                {/* Body Card fields */}
                                <div className="text-sm space-y-1 text-[var(--foreground)]/70">
                                    <p className="leading-relaxed break-words font-medium">
                                        📍 {call.address}
                                    </p>
                                    <p className="text-[13px] font-mono">
                                        ⚙️ Machine: {call.machine_serial || "—"}
                                    </p>
                                </div>

                                {/* Main Touch Open CTA */}
                                <div className="pt-2">
                                    <a
                                        href={`/technician/calls/${call.id}`}
                                        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-700 dark:hover:bg-cyan-400 text-white px-5 py-3 text-center text-sm font-semibold active:scale-98 transition-all shadow-sm cursor-pointer"
                                    >
                                        Ouvrir l&apos;intervention
                                    </a>
                                </div>
                            </div>
                        </DSCard>
                    ))}
                </div>
            )}
        </div>
    );
}

function TechnicianCallsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-12 w-full bg-[var(--foreground)]/5 rounded-2xl" />
            {[...Array(3)].map((_, idx) => (
                <DSCard key={idx} variant="outlined" padding="none" className="p-4 h-44 bg-[var(--foreground)]/5 border-[var(--card-border)]" />
            ))}
        </div>
    );
}
