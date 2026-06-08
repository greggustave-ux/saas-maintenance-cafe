"use client";

import { useOperationsDashboard } from "@/src/modules/service_calls/hooks";
import { useState } from "react";
import { StatusBadge } from "@/src/design-system/components/StatusBadge";
import { DSCard } from "@/src/design-system/components/DSCard";

const STATUS_LABELS: Record<string, string> = {
    new: "Nouveau",
    assigned: "Assigné",
    on_the_way: "En route",
    on_site: "Sur place",
    waiting_parts: "En attente de pièces",
    completed: "Terminé",
    closed: "Clos",
    cancelled: "Annulé",
};

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
            return "border border-slate-355 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350";
        case "cancelled":
            return "border border-red-200 dark:border-red-900/30 bg-red-50/70 dark:bg-red-950/20 text-red-700 dark:text-red-400";
        default:
            return "border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400";
    }
}

export default function OperationsDashboardPage() {
    const { serviceCalls, loading, error, kpis, riskMachines, recentActivity, refresh } = useOperationsDashboard();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (loading) {
        return <OperationsSkeleton />;
    }

    return (
        <div className="w-full mx-auto space-y-6 max-w-7xl animate-fadeIn">
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Tableau de bord des Opérations
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Supervision en temps réel des techniciens, des interventions et du niveau de risque des machines.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                    <svg className={`h-4.5 w-4.5 ${isRefreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                    </svg>
                    Actualiser
                </button>
            </header>

            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-4 text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </div>
            )}

            {/* KPI Section */}
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {/* Total Interventions Today */}
                <DSCard variant="outlined" padding="none" className="p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aujourd&apos;hui</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 block group-hover:scale-102 transition-transform origin-left">
                        {kpis.totalToday}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Intervention(s) créée(s)</span>
                </DSCard>

                {/* Pending */}
                <DSCard variant="outlined" padding="none" className="p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">En attente / cours</span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1.5 block group-hover:scale-102 transition-transform origin-left">
                        {kpis.pending}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">À traiter ou en cours</span>
                </DSCard>

                {/* Completed */}
                <DSCard variant="outlined" padding="none" className="p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Terminées</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 block group-hover:scale-102 transition-transform origin-left">
                        {kpis.completed}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Interventions closes</span>
                </DSCard>

                {/* Problematic Machines */}
                <DSCard variant="outlined" padding="none" className="p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Problématiques</span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1.5 block group-hover:scale-102 transition-transform origin-left">
                        {kpis.problematicMachines}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Machines à risque rouge</span>
                </DSCard>

                {/* Watch Machines */}
                <DSCard variant="outlined" padding="none" className="p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">À surveiller</span>
                    <span className="text-2xl font-bold text-amber-500 mt-1.5 block group-hover:scale-102 transition-transform origin-left">
                        {kpis.watchMachines}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Machines à risque orange</span>
                </DSCard>

                {/* Active Techs */}
                <DSCard variant="outlined" padding="none" className="p-4 shadow-2xs hover:shadow-xs transition-shadow duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Techs actifs</span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1.5 block group-hover:scale-102 transition-transform origin-left">
                        {kpis.activeTechnicians}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Techniciens assignés</span>
                </DSCard>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side: Timeline of recent activity (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Activity Card */}
                    <DSCard variant="outlined" padding="none" className="p-5 sm:p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                                    Activité opérationnelle récente
                                </h2>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Les 10 derniers appels de service mis à jour en temps réel.
                                </p>
                            </div>
                        </div>

                        {recentActivity.length === 0 ? (
                            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                Aucune activité enregistrée récemment.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                                {recentActivity.map((item) => {
                                    const hasPhoto = !!item.photo_url;
                                    const hasSignature = !!item.signature_url;
                                    const isUrgent = item.status === "new"; // Pending means waiting to be addressed

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors"
                                        >
                                            <div className="space-y-1.5 min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">
                                                        #{item.id} — {item.client_name}
                                                    </span>
                                                    <StatusBadge status={item.status} />
                                                    {isUrgent && (
                                                        <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-semibold bg-red-150 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-500/10">
                                                            Urgent
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                                                    <span>
                                                        Tech : <strong className="font-semibold text-slate-700 dark:text-slate-350">{item.technician_name || "Non assigné"}</strong>
                                                    </span>
                                                    <span>
                                                        Machine : <strong className="font-semibold text-slate-700 dark:text-slate-350 break-all">{item.machine_serial || "—"}</strong>
                                                    </span>
                                                    {item.created_at && (
                                                        <span>
                                                            {new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Report Quality indicators */}
                                                <div className="flex items-center gap-3 pt-1">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${hasPhoto ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                                                        📸 Photo {hasPhoto ? "incluse" : "manquante"}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${hasSignature ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                                                        ✍️ Signature {hasSignature ? "client" : "manquante"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                                <a
                                                    href={`/dashboard/service-calls/${item.id}`}
                                                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5 min-h-10 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-98 transition-all border border-slate-200/80 dark:border-slate-700/80"
                                                >
                                                    Visualiser
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </DSCard>

                    {/* Previsional & SLA Targets (Future extensible architecture placeholders) */}
                    <DSCard variant="outlined" padding="none" className="p-5 sm:p-6 shadow-2xs space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                                Objectifs de SLA & Temps réel
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Métriques d&apos;engagements de service et de réactivité.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* SLA Chart mock */}
                            <DSCard variant="flat" padding="none" className="p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Respect du SLA (24h)</span>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">96.8%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96.8%" }} />
                                </div>
                                <p className="text-[10px] text-slate-400">Objectif contractuel : 95.0% • 31 interventions analysées.</p>
                            </DSCard>

                            {/* Response time placeholder */}
                            <DSCard variant="flat" padding="none" className="p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temps moyen de prise en charge</span>
                                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">1.8h</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: "85%" }} />
                                </div>
                                <p className="text-[10px] text-slate-400">Objectif : sous 2.0h • Actuellement en hausse (+0.2h).</p>
                            </DSCard>
                        </div>

                        {/* Interactive Technician Assignation Maps (Placeholder layout) */}
                        <DSCard variant="flat" padding="none" className="p-4 space-y-3 bg-slate-900/5 dark:bg-slate-950/20 relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Suivi Géolocalisation (Futur)</span>
                                    <p className="text-xs text-slate-700 dark:text-slate-350 font-medium">Carte d&apos;assignation dynamique des techniciens sur le terrain</p>
                                </div>
                                <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/15">Bêta Prochainement</span>
                            </div>
                            <div className="h-28 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex flex-col items-center justify-center p-4 text-center">
                                <svg className="h-8 w-8 text-slate-400 animate-pulse mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <p className="text-[10px] text-slate-400 max-w-sm">Le SDK de carte affichera la position en temps réel des techniciens actifs et permettra l&apos;assignation par glisser-déposer.</p>
                            </div>
                        </DSCard>
                    </DSCard>
                </div>

                {/* Right side: Machines at risk and previsons (1 col) */}
                <div className="space-y-6">
                    {/* Machines at Risk Card */}
                    <DSCard variant="outlined" padding="none" className="p-5 sm:p-6 shadow-2xs space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                                Machines à risque
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Équipements nécessitant une surveillance immédiate (score &gt; 30).
                            </p>
                        </div>

                        {riskMachines.length === 0 ? (
                            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                Aucune machine à risque détectée. Stable.
                            </div>
                        ) : (
                            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                                {riskMachines.map((mach) => {
                                    const isProblematic = mach.riskStatus === "Problématique";

                                    return (
                                        <DSCard
                                            key={mach.machine_serial}
                                            variant="flat"
                                            padding="none"
                                            className={`p-3.5 rounded-xl transition-all ${
                                                isProblematic
                                                    ? "!border-red-500/20 !bg-red-500/5 dark:!bg-red-950/10"
                                                    : "!border-amber-500/20 !bg-amber-500/5 dark:!bg-amber-950/10"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-xs text-slate-900 dark:text-white break-all">
                                                    {mach.machine_serial}
                                                </span>
                                                <span className={`text-xs font-bold ${isProblematic ? "text-red-650 dark:text-red-400" : "text-amber-600 dark:text-amber-500"}`}>
                                                    {mach.riskScore}/100
                                                </span>
                                            </div>

                                            <div className="text-[10px] text-slate-400 mt-0.5 space-y-0.5">
                                                <p>Client : <strong className="text-slate-600 dark:text-slate-350">{mach.client_name}</strong></p>
                                                <p>Dernier passage : {mach.lastInterventionDate || "N/A"}</p>
                                                <p>Interventions : {mach.totalInterventions} au total</p>
                                            </div>

                                            <div className={`mt-2 rounded-lg px-2 py-1 text-[10px] font-medium border ${
                                                isProblematic
                                                    ? "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/10"
                                                    : "bg-amber-50/70 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-500/10"
                                            }`}>
                                                Recommandation : {mach.recommendation}
                                            </div>
                                        </DSCard>
                                    );
                                })}
                            </div>
                        )}
                    </DSCard>

                    {/* Previsional Financial Machine Costs (Future extensible architecture placeholders) */}
                    <DSCard variant="outlined" padding="none" className="p-5 sm:p-6 shadow-2xs space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                                Coûts & Maintenance préventive
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Analyse estimative des budgets de maintenance prévisionnels.
                            </p>
                        </div>

                        <div className="space-y-3.5 text-xs">
                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                                <span className="text-slate-500 dark:text-slate-400">Coût estimé (toutes machines) :</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    ${riskMachines.reduce((acc, curr) => acc + (curr.totalInterventions * 150), 0) + (serviceCalls.length * 100)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                                <span className="text-slate-500 dark:text-slate-400">Taux de pannes répétées :</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {riskMachines.length > 0 ? `${Math.round((riskMachines.filter(m => m.totalInterventions >= 2).length / Math.max(riskMachines.length, 1)) * 100)}%` : "0%"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1.5">
                                <span className="text-slate-500 dark:text-slate-400">Maintenance préventive :</span>
                                <span className="font-semibold text-cyan-600 dark:text-cyan-400">3 planifiées</span>
                            </div>
                        </div>

                        {/* Interactive trigger box */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => alert("Simulation : Déclenchement de la campagne de maintenance préventive sur les machines à score élevé.")}
                                className="w-full py-2.5 px-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/15 active:scale-98 transition-all text-xs font-semibold cursor-pointer text-center"
                            >
                                Déclencher plan préventif
                            </button>
                        </div>
                    </DSCard>
                </div>
            </div>
        </div>
    );
}

function OperationsSkeleton() {
    return (
        <div className="w-full mx-auto space-y-6 max-w-7xl animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 dark:border-slate-800 pb-5">
                <div className="space-y-2">
                    <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-96 bg-slate-150 dark:bg-slate-850 rounded" />
                </div>
                <div className="h-12 w-32 bg-slate-200 dark:bg-slate-850 rounded-xl" />
            </div>

            {/* KPI grid skeleton */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {[...Array(6)].map((_, idx) => (
                    <DSCard key={idx} variant="outlined" padding="none" className="h-24 bg-slate-150 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850" />
                ))}
            </div>

            {/* Main grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DSCard variant="outlined" padding="none" className="h-[400px] bg-slate-150 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850" />
                    <DSCard variant="outlined" padding="none" className="h-[300px] bg-slate-150 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850" />
                </div>
                <div className="space-y-6">
                    <DSCard variant="outlined" padding="none" className="h-[350px] bg-slate-150 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850" />
                    <DSCard variant="outlined" padding="none" className="h-[250px] bg-slate-150 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850" />
                </div>
            </div>
        </div>
    );
}
