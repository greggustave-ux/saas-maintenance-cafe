import { useState } from "react";
import { ServiceCall } from "../types";
import { analyzeMachineHistory } from "../utils/machine-intelligence";

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
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

    // Filter out the current intervention so we only show the history list
    const otherInterventions = machineHistory.filter((item) => item.id !== currentCallId);

    function toggleExpand(id: number) {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    const analysis = analyzeMachineHistory(machineHistory);

    return (
        <section className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6 space-y-4 min-w-0 overflow-hidden">
            <div className="flex flex-col gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                        Historique de la machine
                    </h2>
                    <span className="inline-flex items-center self-start sm:self-auto rounded-full bg-cyan-50 dark:bg-cyan-950/30 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:text-cyan-400 border border-cyan-200/25">
                        {otherInterventions.length} précédente(s)
                    </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Suivi des interventions sur ce numéro de série
                </p>
            </div>

            {/* Machine Intelligence Panel */}
            {machineHistory.length > 0 && !machineHistoryLoading && (
                <div className={`rounded-xl border p-4 space-y-3.5 transition-all animate-fadeIn ${
                    analysis.riskStatus === "Problématique"
                        ? "border-red-500/20 bg-red-500/5 dark:bg-red-950/10"
                        : analysis.riskStatus === "À surveiller"
                        ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10"
                        : "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10"
                }`}>
                    {/* Header: Status and Score */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Analyse prédictive
                            </span>
                            <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-semibold border ${
                                analysis.riskStatus === "Problématique"
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                    : analysis.riskStatus === "À surveiller"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            }`}>
                                {analysis.riskStatus}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Score de risque :</span>
                            <span className={`text-base font-bold ${
                                analysis.riskStatus === "Problématique"
                                    ? "text-red-600 dark:text-red-400"
                                    : analysis.riskStatus === "À surveiller"
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-emerald-600 dark:text-emerald-400"
                            }`}>
                                {analysis.riskScore}/100
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                analysis.riskStatus === "Problématique"
                                    ? "bg-red-500"
                                    : analysis.riskStatus === "À surveiller"
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                            }`}
                            style={{ width: `${analysis.riskScore}%` }}
                        />
                    </div>

                    {/* Recommendation Banner */}
                    <div className={`rounded-lg px-3 py-2 text-xs font-medium border flex items-center gap-2 ${
                        analysis.riskStatus === "Problématique"
                            ? "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/15"
                            : analysis.riskStatus === "À surveiller"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/15"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/15"
                    }`}>
                        <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            {analysis.riskStatus === "Stable" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            )}
                        </svg>
                        <span>
                            Recommandation : <strong className="font-semibold">{analysis.recommendation}</strong> ({analysis.riskExplanation})
                        </span>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 pt-2 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-800/40">
                        <div>
                            <span className="font-bold text-slate-400 uppercase tracking-wider block">Interventions</span>
                            <p className="font-semibold text-slate-800 dark:text-slate-350 mt-0.5 text-xs">
                                {analysis.totalInterventions} au total
                            </p>
                            <p className="text-[10px] mt-0.5 text-slate-400">
                                {analysis.interventions30Days} en 30j. / {analysis.interventions90Days} en 90j.
                            </p>
                        </div>
                        <div>
                            <span className="font-bold text-slate-400 uppercase tracking-wider block">Qualité rapports</span>
                            <p className="font-semibold text-slate-800 dark:text-slate-350 mt-0.5 text-xs">
                                📸 {analysis.hasPhotosCount} photo{analysis.hasPhotosCount > 1 ? "s" : ""}
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-slate-350 text-xs">
                                ✍️ {analysis.hasSignaturesCount} signature{analysis.hasSignaturesCount > 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <span className="font-bold text-slate-400 uppercase tracking-wider block">Dernier passage</span>
                            <p className="font-semibold text-slate-800 dark:text-slate-350 mt-0.5 text-xs">
                                {analysis.lastInterventionDate || "N/A"}
                            </p>
                            <p className="text-[10px] mt-0.5 text-slate-400">
                                par {analysis.lastTechnician || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Extensible Future Financial Placeholders Panel */}
                    <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/40 text-[10px] space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">Coût total maintenance (est.)</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">${analysis.estimatedMaintenanceCost}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">Fréquence moyenne</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{analysis.averageInterventionFrequency}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">Risque d'indisponibilité (downtime)</span>
                            <span className={`font-bold px-1.5 py-0.5 rounded-md ${
                                analysis.downtimeRisk === "Élevé"
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10"
                                    : analysis.downtimeRisk === "Moyen"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                            }`}>{analysis.downtimeRisk}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-400 uppercase tracking-wider">Préconisation remplacement</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{analysis.replacementRecommendation}</span>
                        </div>
                        {analysis.mostFrequentParts.length > 0 && (
                            <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                                <span className="font-bold text-slate-400 uppercase tracking-wider mr-1">Pièces fréquentes :</span>
                                {analysis.mostFrequentParts.map((p, idx) => (
                                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-medium px-2 py-0.5 rounded text-[10px]">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                            <div className="h-3 w-5/6 bg-slate-150 dark:bg-slate-855 rounded" />
                        </div>
                    </div>
                </div>
            ) : otherInterventions.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Aucune autre intervention enregistrée pour cette machine.
                </div>
            ) : (
                <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-5 space-y-6 pt-2 max-h-[420px] overflow-y-auto pr-2 min-w-0">
                    {otherInterventions.map((item) => {
                        const dateStr = item.created_at
                            ? new Date(item.created_at).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                              })
                            : `Intervention #${item.id}`;

                        const isExpanded = !!expandedIds[item.id];

                        return (
                            <div key={item.id} className="relative group min-w-0">
                                {/* Timeline Bullet dot */}
                                <div className="absolute -left-[26px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-cyan-500 dark:bg-cyan-400 group-hover:scale-125 transition-transform" />

                                <div className="space-y-2.5 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">
                                                {dateStr}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${getStatusBadgeClass(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(item.id)}
                                                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 inline-flex items-center gap-1 min-h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-98 transition-all border border-slate-250/20 cursor-pointer"
                                            >
                                                {isExpanded ? "Masquer" : "Détails"}
                                                <svg className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <a
                                                href={`/dashboard/service-calls/${item.id}`}
                                                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5 min-h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-98 transition-all shadow-xs border border-slate-250/20 shrink-0"
                                            >
                                                Ouvrir
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-500 dark:text-slate-400 min-w-0 truncate">
                                        Technicien : <span className="font-medium text-slate-800 dark:text-slate-350">{item.technician_name || "Non assigné"}</span>
                                    </div>

                                    {/* Issue / Notes preview */}
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-850/40 p-2.5 border border-slate-200/10 text-xs text-slate-600 dark:text-slate-350 leading-relaxed max-w-full min-w-0 break-words">
                                        <p className="font-semibold text-[9px] uppercase text-slate-400 tracking-wider mb-0.5">Notes de clôture / Description</p>
                                        <p className="line-clamp-2">
                                            {item.technician_notes || item.issue_description}
                                        </p>
                                    </div>

                                    {/* Expandable detailed past history (Mocked UI components) */}
                                    {isExpanded && (
                                        <div className="mt-2.5 space-y-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 p-3.5 border border-slate-200/10 text-xs animate-fadeIn">
                                            {/* Technician and Machine Status */}
                                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200/50 dark:border-slate-800/40">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Technicien</span>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{item.technician_name || "Non assigné"}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Statut Machine</span>
                                                    <p className="font-semibold text-slate-850 dark:text-slate-200 mt-0.5">
                                                        {item.status === "Terminé" ? "🟢 Opérationnel" : "🟡 En maintenance"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Parts replaced */}
                                            <div className="pb-3 border-b border-slate-200/50 dark:border-slate-800/40">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Pièces remplacées</span>
                                                {item.id % 2 === 0 ? (
                                                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                                                        <li>Joint torique haute pression (x2)</li>
                                                        <li>Fluide hydraulique 1L (x1)</li>
                                                    </ul>
                                                ) : (
                                                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 font-medium">
                                                        <li>Filtre d'admission d'air (x1)</li>
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Previous Photos & Signatures */}
                                            <div className="grid grid-cols-2 gap-3.5">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Photos</span>
                                                    <div className="flex gap-2">
                                                        <div className="h-12 w-16 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300/40 flex items-center justify-center text-slate-400">
                                                            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="h-12 w-16 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300/40 flex items-center justify-center text-slate-400">
                                                            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Signature client</span>
                                                    <div className="h-12 w-full rounded bg-slate-250 dark:bg-slate-800 border border-slate-300/40 p-1 flex items-center justify-center">
                                                        {item.signature_url ? (
                                                            <img
                                                                src={item.signature_url}
                                                                alt="Signature client"
                                                                loading="lazy"
                                                                className="h-9 w-auto object-contain max-w-full"
                                                            />
                                                        ) : (
                                                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                                                ✍️ Approuvé
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
