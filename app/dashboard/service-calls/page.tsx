"use client";

import { useServiceCalls } from "@/src/modules/service_calls/hooks";
import ServiceCallCard, { ServiceCallCardSkeleton } from "@/src/modules/service_calls/components/ServiceCallCard";
import NewServiceCallForm from "@/src/modules/service_calls/components/NewServiceCallForm";

const inputClass =
    "w-full min-h-12 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

function getStatusColor(status: string) {
    switch (status) {
        case "En attente":
            return "border border-amber-200 dark:border-amber-900/30 bg-amber-50/70 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400";
        case "En cours":
            return "border border-blue-200 dark:border-blue-900/30 bg-blue-50/70 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400";
        case "Terminé":
            return "border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400";
        default:
            return "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400";
    }
}

export default function ServiceCallsPage() {
    const {
        search,
        setSearch,
        isFormOpen,
        setIsFormOpen,
        loading,
        error,
        successMessage,
        form,
        handleCreateServiceCall,
        handleUpdateStatus,
        handleDeleteServiceCall,
        filteredCalls,
    } = useServiceCalls();

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 md:max-w-4xl">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Appels de service
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Gérez et suivez les interventions terrain en temps réel
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 px-5 py-3 text-base font-semibold text-white hover:bg-cyan-700 dark:hover:bg-cyan-400 active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={isFormOpen ? "M18 12H6" : "M12 6v12M6 12h12"} />
                    </svg>
                    {isFormOpen ? "Fermer le formulaire" : "Nouvel appel"}
                </button>
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

            {isFormOpen && (
                <NewServiceCallForm
                    form={form}
                    onSubmit={handleCreateServiceCall}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    className={`${inputClass} pl-11`}
                    placeholder="Rechercher un client..."
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
                            <p className="text-slate-500 dark:text-slate-400">Aucun appel de service trouvé.</p>
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
