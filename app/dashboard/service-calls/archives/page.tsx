"use client";

import { useArchivedServiceCalls } from "@/src/modules/service_calls/hooks";
import ServiceCallCard, { ServiceCallCardSkeleton } from "@/src/modules/service_calls/components/ServiceCallCard";
import { STATUS_LABELS } from "../page";

const inputClass =
    "w-full min-h-12 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

function getStatusColor(status: string) {
    switch (status) {
        case "new":
            return "border border-sky-200 dark:border-sky-900/30 bg-sky-50/70 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400";
        case "assigned":
            return "border border-indigo-200 dark:border-indigo-900/30 bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400";
        case "on_the_way":
            return "border border-amber-200 dark:border-amber-900/30 bg-amber-50/70 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400";
        case "on_site":
            return "border border-blue-200 dark:border-blue-900/30 bg-blue-50/70 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400";
        case "waiting_parts":
            return "border border-purple-200 dark:border-purple-900/30 bg-purple-50/70 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400";
        case "completed":
            return "border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400";
        case "closed":
            return "border border-slate-350 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350";
        case "cancelled":
            return "border border-red-200 dark:border-red-900/30 bg-red-50/70 dark:bg-red-950/20 text-red-700 dark:text-red-400";
        default:
            return "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400";
    }
}

export default function ArchivedServiceCallsPage() {
    const {
        search,
        setSearch,
        loading,
        error,
        successMessage,
        handleUpdateStatus,
        handleDeleteServiceCall,
        filteredCalls,
        userRole,
    } = useArchivedServiceCalls();

    if (!loading && userRole === "technician") {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center p-4">
                <div className="rounded-full bg-red-100 dark:bg-red-955/20 p-3.5 text-red-600 dark:text-red-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-8v6m0 5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Accès non autorisé</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                    Cette section est réservée exclusivement aux administrateurs et répartiteurs pour la gestion des archives.
                </p>
                <a href="/dashboard/service-calls" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                    Retour aux appels de service
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 md:max-w-4xl">
            <header className="space-y-3">
                <a href="/dashboard/service-calls" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour aux appels
                </a>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Archives des interventions
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Consultez l'historique complet des interventions archivées
                        </p>
                    </div>
                </div>
            </header>

            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-4 text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 text-sm text-emerald-600 dark:text-emerald-400 animate-fadeIn" role="alert">
                    {successMessage}
                </div>
            )}

            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    className={`${inputClass} pl-11`}
                    placeholder="Rechercher par référence (ex: SC-2026), client, machine, adresse..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    <ServiceCallCardSkeleton />
                    <ServiceCallCardSkeleton />
                    <ServiceCallCardSkeleton />
                    <ServiceCallCardSkeleton />
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {filteredCalls.length === 0 ? (
                        <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 dark:text-slate-400">Aucun appel de service archivé trouvé.</p>
                        </div>
                    ) : (
                        filteredCalls.map((call) => (
                            <ServiceCallCard
                                key={call.id}
                                call={call}
                                updateStatus={handleUpdateStatus}
                                deleteCall={handleDeleteServiceCall}
                                getStatusColor={getStatusColor}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
