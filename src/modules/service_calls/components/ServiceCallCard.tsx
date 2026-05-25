"use client";

import { ServiceCall } from "../types";

interface ServiceCallCardProps {
    call: ServiceCall;
    updateStatus: (id: number, status: string) => Promise<void>;
    deleteCall: (id: number) => Promise<void>;
    getStatusColor: (status: string) => string;
}

export default function ServiceCallCard({
    call,
    updateStatus,
    deleteCall,
    getStatusColor,
}: ServiceCallCardProps) {
    return (
        <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <a
                        href={`/dashboard/service-calls/${call.id}`}
                        className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-snug"
                    >
                        {call.client_name}
                    </a>
                    
                    <div className="shrink-0">
                        <select
                            value={call.status}
                            onChange={(e) =>
                                updateStatus(call.id, e.target.value)
                            }
                            aria-label={`Statut pour ${call.client_name}`}
                            className={`min-h-9 rounded-lg px-2.5 py-1 text-xs font-semibold ${getStatusColor(call.status)} cursor-pointer focus:ring-0`}
                        >
                            <option>En attente</option>
                            <option>En cours</option>
                            <option>Terminé</option>
                        </select>
                    </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-sm">
                    <div className="col-span-2">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Adresse
                        </dt>
                        <dd className="mt-1 font-medium text-slate-700 dark:text-slate-300 break-words leading-relaxed">
                            {call.address}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            N° série machine
                        </dt>
                        <dd className="mt-0.5 font-medium text-slate-700 dark:text-slate-300 break-all">
                            {call.machine_serial || "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Technicien
                        </dt>
                        <dd className="mt-0.5 font-medium text-slate-700 dark:text-slate-300">
                            {call.technician_name || "Non assigné"}
                        </dd>
                    </div>
                    <div className="col-span-2">
                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Problème
                        </dt>
                        <dd className="mt-1 text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {call.issue_description}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="mt-6 flex gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <a
                    href={`/dashboard/service-calls/${call.id}`}
                    className="flex-1 flex min-h-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-98 transition-all"
                >
                    Ouvrir la fiche
                </a>
                <button
                    type="button"
                    onClick={() => deleteCall(call.id)}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 active:scale-95 transition-all cursor-pointer"
                    aria-label="Supprimer l'appel"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </article>
    );
}
