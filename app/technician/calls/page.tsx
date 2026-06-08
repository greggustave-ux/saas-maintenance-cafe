"use client";

import React from "react";
import { useServiceCalls } from "@/src/modules/service_calls/hooks";
import { DSBadge } from "@/src/design-system/components/DSBadge";
import { DSCard } from "@/src/design-system/components/DSCard";

const inputClass =
    "w-full min-h-12 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xs px-4 py-3 pl-11 text-sm text-[var(--foreground)] placeholder-[var(--foreground)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 shadow-2xs transition-all duration-200 focus:border-[var(--primary)]";

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
                <DSCard variant="default" padding="lg" className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-3xl">🔍</span>
                        <h3 className="text-base font-bold text-[var(--foreground)]">Aucune intervention</h3>
                        <p className="text-sm text-[var(--foreground)]/50 max-w-[240px] mx-auto leading-relaxed">
                            Aucun appel de service n&apos;est assigné à votre nom pour le moment.
                        </p>
                    </div>
                </DSCard>
            ) : (
                <div className="space-y-4">
                    {filteredCalls.map((call) => (
                        <DSCard
                            key={call.id}
                            variant="outlined"
                            padding="none"
                            className="p-4 relative overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-200"
                        >
                            {/* Floating priority indicator pill */}
                            <div className={`absolute top-3 left-3 w-1 bottom-3 rounded-full ${
                                call.priority === "urgent" || call.priority === "high" ? "bg-red-500" : "bg-cyan-500"
                            }`} />

                            <div className="pl-4 space-y-3.5">
                                {/* Header Card row */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        {call.reference_number && (
                                            <span className="block text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase leading-none">
                                                {call.reference_number}
                                            </span>
                                        )}
                                        <h3 className="text-[17px] font-bold text-[var(--foreground)] leading-tight tracking-tight">
                                            {call.client_name}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <DSBadge category="status" variant={call.status || "new"} className="text-[10px] rounded-md" />
                                        <DSBadge category="priority" variant={call.priority || "medium"} className="text-[9px] rounded-md font-extrabold" />
                                    </div>
                                </div>

                                {/* Body Card fields */}
                                <div className="space-y-2.5">
                                    <div className="flex items-start gap-2 text-sm text-[var(--foreground)]/75 leading-relaxed break-words">
                                        <span className="shrink-0 text-slate-400 mt-0.5" aria-hidden="true">
                                            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                        <span className="font-medium">{call.address}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-bold text-[var(--foreground)]/45 uppercase tracking-wider">Équipement:</span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-[11px] font-mono font-medium text-[var(--foreground)]/75">
                                            {call.machine_serial || "Non renseigné"}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Touch Open CTA */}
                                <div className="pt-2">
                                    <a
                                        href={`/technician/calls/${call.id}`}
                                        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-white text-white dark:text-slate-950 px-5 py-3 text-center text-sm font-semibold active:scale-98 transition-all shadow-xs cursor-pointer"
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
                <DSCard key={idx} variant="outlined" padding="none" className="p-4 h-44 bg-[var(--foreground)]/5 border-[var(--card-border)] relative">
                    <div className="absolute top-3 left-3 w-1 bottom-3 rounded-full bg-[var(--foreground)]/10" />
                </DSCard>
            ))}
        </div>
    );
}
