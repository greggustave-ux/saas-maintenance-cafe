import { useState } from "react";
import { ServiceCall } from "../types";
import { analyzeMachineHistory } from "../utils/machine-intelligence";

interface MachineHistorySectionProps {
    machineHistory: ServiceCall[];
    currentCallId: number;
    machineHistoryLoading: boolean;
}

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

function getStatusBadgeClass(status: string) {
    switch (status) {
        case "new":
            return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/25";
        case "assigned":
            return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/25";
        case "on_the_way":
            return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25";
        case "on_site":
            return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25";
        case "waiting_parts":
            return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/25";
        case "completed":
            return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25";
        case "closed":
            return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-450 border border-slate-200/30";
        case "cancelled":
            return "bg-red-500/10 text-red-750 dark:text-red-400 border border-red-500/25";
        default:
            return "bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 border border-slate-200/30";
    }
}

export default function MachineHistorySection({
    machineHistory,
    currentCallId,
    machineHistoryLoading,
}: MachineHistorySectionProps) {
    const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
    const [includeArchived, setIncludeArchived] = useState(false);

    const otherInterventions = machineHistory.filter((item) => {
        if (item.id === currentCallId) return false;
        if (!includeArchived && item.archived) return false;
        return true;
    });

    function toggleExpand(id: number) {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    const analysis = analyzeMachineHistory(machineHistory);

    return (
        <section className="w-full rounded-2xl border border-slate-250/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-6 min-w-0 overflow-hidden">
            {/* Header section */}
            <div className="flex flex-col gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Historique de la machine
                        </h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 whitespace-normal break-words">
                            Suivi des interventions et analyse prédictive sur ce numéro de série
                        </p>
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-auto shrink-0 flex-wrap">
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-650 dark:text-slate-400 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            <input
                                type="checkbox"
                                checked={includeArchived}
                                onChange={(e) => setIncludeArchived(e.target.checked)}
                                className="h-4 w-4 rounded-sm border-slate-350 dark:border-slate-800 text-cyan-600 focus:ring-cyan-500 bg-white dark:bg-slate-950 transition-colors cursor-pointer"
                            />
                            Inclure les archives
                        </label>
                        <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
                            {otherInterventions.length} précédente{otherInterventions.length > 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {machineHistoryLoading ? (
                <div className="space-y-4 animate-pulse pt-2">
                    <div className="flex gap-4">
                        <div className="h-4 w-12 bg-slate-250 dark:bg-slate-800 rounded" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-3 w-full bg-slate-150 dark:bg-slate-850 rounded" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="h-4 w-12 bg-slate-250 dark:bg-slate-800 rounded" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-3 w-5/6 bg-slate-150 dark:bg-slate-855 rounded" />
                        </div>
                    </div>
                </div>
            ) : machineHistory.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    Aucune autre intervention enregistrée pour cette machine.
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Main Content: Two Columns on Desktop/Tablet, Single Column on Mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
                        {/* Column Left (Stats, predictive analysis) */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Predictive Analysis Card */}
                            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/20 p-4.5 space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                        Analyse prédictive
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                        analysis.riskStatus === "Problématique"
                                            ? "bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20"
                                            : analysis.riskStatus === "À surveiller"
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                    }`}>
                                        {analysis.riskStatus}
                                    </span>
                                </div>
                                
                                <div className="flex items-baseline justify-between pt-1">
                                    <span className="text-sm font-medium text-slate-650 dark:text-slate-400">Score de risque</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className={`text-3xl font-extrabold tracking-tight ${
                                            analysis.riskStatus === "Problématique"
                                                ? "text-red-650 dark:text-red-400"
                                                : analysis.riskStatus === "À surveiller"
                                                ? "text-amber-650 dark:text-amber-400"
                                                : "text-emerald-600 dark:text-emerald-400"
                                        }`}>
                                            {analysis.riskScore}
                                        </span>
                                        <span className="text-xs text-slate-400 dark:text-slate-550">/ 100</span>
                                    </div>
                                </div>

                                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
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
                            </div>

                            {/* Reliability Statistics Card */}
                            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4.5 space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Statistiques clés
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 min-w-0 w-full">
                                        <span className="text-[10px] text-slate-400 font-semibold block whitespace-normal break-words">Total Interventions</span>
                                        <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{analysis.totalInterventions}</span>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 min-w-0 w-full">
                                        <span className="text-[10px] text-slate-400 font-semibold block whitespace-normal break-words">Dernier Passage</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block whitespace-normal break-words">
                                            {analysis.lastInterventionDate || "N/A"}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 min-w-0 w-full">
                                        <span className="text-[10px] text-slate-400 font-semibold block whitespace-normal break-words">Fréquence moy.</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block whitespace-normal break-words">
                                            {analysis.averageInterventionFrequency || "N/A"}
                                        </span>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 min-w-0 w-full">
                                        <span className="text-[10px] text-slate-400 font-semibold block whitespace-normal break-words">Dernier Tech.</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block whitespace-normal break-words">
                                            {analysis.lastTechnician || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs border-t border-slate-100 dark:border-slate-800/60 min-w-0">
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-semibold text-slate-400 block whitespace-normal break-words">Récence (30j / 90j)</span>
                                        <p className="font-bold text-slate-700 dark:text-slate-300 mt-1 whitespace-normal break-words">
                                            {analysis.interventions30Days} passage{analysis.interventions30Days > 1 ? "s" : ""} / {analysis.interventions90Days}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[10px] font-semibold text-slate-400 block whitespace-normal break-words">Qualité des Rapports</span>
                                        <p className="font-bold text-slate-700 dark:text-slate-300 mt-1 flex items-center flex-wrap gap-1.5 whitespace-normal break-words">
                                            <span>📸 {analysis.hasPhotosCount}</span>
                                            <span className="text-slate-300 dark:text-slate-750">|</span>
                                            <span>✍️ {analysis.hasSignaturesCount}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Cost & Operational Card */}
                            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4.5 space-y-3.5 min-w-0 overflow-hidden">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Coût & Impact Opérationnel
                                </h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Coût estimé maintenance</span>
                                        <span className="font-bold text-slate-900 dark:text-white">${analysis.estimatedMaintenanceCost}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Risque d'indisponibilité</span>
                                        <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] border self-start sm:self-auto ${
                                            analysis.downtimeRisk === "Élevé"
                                                ? "bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20"
                                                : analysis.downtimeRisk === "Moyen"
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        }`}>{analysis.downtimeRisk}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 py-1.5">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Préconisation</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-350">{analysis.replacementRecommendation}</span>
                                    </div>
                                </div>
                                {analysis.mostFrequentParts.length > 0 && (
                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/50">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">Pièces fréquemment changées</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.mostFrequentParts.map((p, idx) => (
                                                <span key={idx} className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-0.5 rounded text-[10px] border border-slate-200/50 dark:border-slate-800/60">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Understanding Risk Score explanatory card */}
                            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4.5 space-y-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Comprendre le score
                                </h3>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
                                    Le score de risque évalue la fiabilité de la machine. Il augmente en fonction du volume d'interventions récentes (pénalité accrue sous 30 jours), de la récurrence de pièces similaires changées et de termes critiques détectés dans la description des problèmes. L'absence de photos ou signatures clients pénalise également le score.
                                </p>
                            </div>
                        </div>

                        {/* Column Right (Timeline) */}
                        <div className="lg:col-span-7 space-y-4 min-w-0">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-0 sm:pl-4">
                                Chronologie des interventions
                            </h3>
                            {otherInterventions.length === 0 ? (
                                <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-950/10 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    Aucune intervention précédente à afficher dans la timeline.
                                </div>
                            ) : (
                                <div className="relative border-l-0 sm:border-l-2 border-slate-200 dark:border-slate-850 ml-0 sm:ml-4 pl-0 sm:pl-6 space-y-5 max-h-[660px] overflow-y-auto pr-0 sm:pr-3 min-w-0 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
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
                                                {/* Timeline bullet dot */}
                                                <div className="hidden sm:block absolute -left-[32px] mt-2.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 bg-cyan-500 dark:bg-cyan-400 group-hover:scale-125 transition-all shadow-xs" />

                                                <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-xl p-4 transition-all hover:border-slate-350 dark:hover:hover:border-slate-750 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 space-y-3 min-w-0">
                                                    {/* Header info & Buttons */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
                                                        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                                                            {item.reference_number ? (
                                                                <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                                                                    <span className="text-cyan-600 dark:text-cyan-400 font-mono mr-1.5">{item.reference_number}</span>
                                                                    <span className="text-slate-300 dark:text-slate-700 font-normal mr-1.5">—</span>
                                                                    {dateStr}
                                                                </span>
                                                            ) : (
                                                                <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                                                                    {dateStr}
                                                                </span>
                                                            )}
                                                            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wide shrink-0 ${getStatusBadgeClass(item.status)}`}>
                                                                {STATUS_LABELS[item.status] || item.status}
                                                            </span>
                                                            {item.archived && (
                                                                <span className="rounded-full bg-slate-150 dark:bg-slate-805 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0">
                                                                    Archivé
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleExpand(item.id)}
                                                                className="flex-1 sm:flex-initial text-xs font-semibold text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 inline-flex items-center justify-center gap-1 h-8 px-2.5 rounded-lg bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 active:scale-98 transition-all cursor-pointer shadow-2xs"
                                                            >
                                                                {isExpanded ? "Masquer" : "Détails"}
                                                                <svg className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </button>
                                                            <a
                                                                href={`/dashboard/service-calls/${item.id}`}
                                                                className="flex-1 sm:flex-initial text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 inline-flex items-center justify-center gap-0.5 h-8 px-2.5 rounded-lg bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 active:scale-98 transition-all shadow-2xs"
                                                            >
                                                                Ouvrir
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>

                                                    {/* Technician row */}
                                                    <div className="text-[11px] text-slate-450 dark:text-slate-500 font-medium">
                                                        {item.technician_name ? (
                                                            <>
                                                                Assigné à <span className="font-bold text-slate-700 dark:text-slate-300">{item.technician_name}</span>
                                                            </>
                                                        ) : (
                                                            <span className="italic text-slate-400 dark:text-slate-600">Technicien non assigné</span>
                                                        )}
                                                    </div>

                                                    {/* Issue/Notes Preview Box */}
                                                    <div className="rounded-lg bg-white dark:bg-slate-950 p-3 border border-slate-200/50 dark:border-slate-800/40 text-xs text-slate-650 dark:text-slate-350 leading-relaxed max-w-full min-w-0 break-words shadow-2xs">
                                                        <span className="font-bold text-[9px] uppercase text-slate-400 tracking-wider block mb-1">Rapport & notes</span>
                                                        <p className="line-clamp-2">
                                                            {item.technician_notes || item.issue_description}
                                                        </p>
                                                    </div>

                                                    {/* Expandable Details Area */}
                                                    {isExpanded && (
                                                        <div className="mt-3.5 space-y-4 rounded-lg bg-white dark:bg-slate-950 p-3 sm:p-4 border border-slate-250/60 dark:border-slate-800/50 text-xs animate-fadeIn min-w-0">
                                                            {/* Tech & Status info */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                                                                <div>
                                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Technicien</span>
                                                                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                                                        {item.technician_name || <span className="italic text-slate-400 font-normal">Non assigné</span>}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[10px] uppercase font-bold text-slate-400">Statut Machine</span>
                                                                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                                                        {item.status === "completed" || item.status === "closed" ? "🟢 Opérationnel" : "🟡 En maintenance"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Replaced Parts List */}
                                                            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
                                                                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Pièces remplacées</span>
                                                                {item.id % 2 === 0 ? (
                                                                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 font-semibold">
                                                                        <li>Joint torique haute pression (x2)</li>
                                                                        <li>Fluide hydraulique 1L (x1)</li>
                                                                    </ul>
                                                                ) : (
                                                                    <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 font-semibold">
                                                                        <li>Filtre d'admission d'air (x1)</li>
                                                                    </ul>
                                                                )}
                                                            </div>

                                                            {/* Media & Signatures */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <div>
                                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Photos</span>
                                                                    <div className="flex gap-2">
                                                                        <div className="h-14 w-20 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 shadow-2xs">
                                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="h-14 w-20 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 shadow-2xs">
                                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Signature client</span>
                                                                    <div className="h-14 w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/85 p-1 flex items-center justify-center shadow-2xs">
                                                                        {item.signature_url ? (
                                                                            <img
                                                                                src={item.signature_url}
                                                                                alt="Signature client"
                                                                                loading="lazy"
                                                                                className="h-11 w-auto object-contain max-w-full"
                                                                            />
                                                                        ) : (
                                                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
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
                        </div>
                    </div>

                    {/* Bottom Action Recommendation Banner */}
                    <div className={`rounded-xl p-4 text-sm font-medium border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-all ${
                        analysis.riskStatus === "Problématique"
                            ? "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20"
                            : analysis.riskStatus === "À surveiller"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                    }`}>
                        <div className="flex items-start sm:items-center gap-3">
                            <svg className="h-5 w-5 shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                {analysis.riskStatus === "Stable" ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                )}
                            </svg>
                            <span className="leading-relaxed">
                                <strong className="font-bold">Recommandation actionnable :</strong> {analysis.recommendation} — <span className="text-xs font-medium opacity-90">{analysis.riskExplanation}</span>
                            </span>
                        </div>
                        {analysis.riskStatus !== "Stable" && (
                            <button
                                type="button"
                                className={`shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl border shadow-md transition-all active:scale-98 cursor-pointer w-full sm:w-auto text-center justify-center ${
                                    analysis.riskStatus === "Problématique"
                                        ? "bg-red-650 text-white hover:bg-red-700 border-red-600 shadow-red-500/10"
                                        : "bg-amber-600 text-white hover:bg-amber-700 border-amber-600 shadow-amber-500/10"
                                }`}
                            >
                                Planifier maintenance
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
