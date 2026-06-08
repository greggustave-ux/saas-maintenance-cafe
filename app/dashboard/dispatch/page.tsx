"use client";

import { useDispatchBoard } from "@/src/modules/service_calls/hooks";
import DispatchBoard from "@/src/modules/service_calls/components/dispatch/DispatchBoard";

function DispatchBoardSkeleton() {
    return (
        <div className="w-full space-y-6 animate-pulse">
            {/* KPI grid skeleton */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900" />
                ))}
            </div>
            {/* Search skeleton */}
            <div className="h-11 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            {/* Columns skeleton */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[60vh] w-[290px] sm:w-[310px] shrink-0 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20" />
                ))}
            </div>
        </div>
    );
}

export default function DispatchPage() {
    const {
        serviceCalls,
        loading,
        error,
        successMessage,
        kpis,
        userRole,
        technicians,
        updateStatus,
        updatePriority,
        updateTechnician,
        archiveCall,
    } = useDispatchBoard();

    // Access check: Dispatch board is restricted to admin and dispatcher roles
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
                    Cette section est réservée exclusivement aux administrateurs et répartiteurs pour la gestion logistique.
                </p>
                <a href="/dashboard/service-calls" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                    Retour aux appels de service
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-full mx-auto space-y-6 px-1 md:px-0">
            {/* Header section */}
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Tableau de Dispatch
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Visualisez et répartissez les appels de service en temps réel
                    </p>
                </div>
            </header>

            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-955/20 border border-red-100 dark:border-red-900/30 p-4 text-sm text-red-650 dark:text-red-400" role="alert">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 text-sm text-emerald-650 dark:text-emerald-400 animate-fadeIn" role="alert">
                    {successMessage}
                </div>
            )}

            {loading ? (
                <DispatchBoardSkeleton />
            ) : (
                <div className="space-y-6">
                    {/* KPIs Section */}
                    <section className="grid gap-4 grid-cols-2 lg:grid-cols-5">
                        {/* Active Calls */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-750 transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Appels Actifs
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {kpis.active}
                                </span>
                                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Urgent Calls */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-750 transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Appels Urgents
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-extrabold tracking-tight text-red-600 dark:text-red-400">
                                    {kpis.urgent}
                                </span>
                                <span className="p-1.5 rounded-lg bg-red-500/10 text-red-650 dark:text-red-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Awaiting Parts */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-750 transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                En attente Pièce
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400">
                                    {kpis.waitingParts}
                                </span>
                                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-650 dark:text-purple-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Completed Today */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-750 transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Terminés Aujourd'hui
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {kpis.completedToday}
                                </span>
                                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-650 dark:text-emerald-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Active Technicians */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-750 transition-colors col-span-2 lg:col-span-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                Techniciens Actifs
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {kpis.activeTechs}
                                </span>
                                <span className="p-1.5 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Kanban Board */}
                    <DispatchBoard
                        serviceCalls={serviceCalls}
                        updateStatus={updateStatus}
                        updatePriority={updatePriority}
                        updateTechnician={updateTechnician}
                        technicians={technicians}
                        archiveCall={archiveCall}
                        userRole={userRole}
                    />
                </div>
            )}
        </div>
    );
}
