"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase-client";

type ServiceCall = {
    id: number;
    client_name: string;
    address: string;
    machine_serial: string;
    issue_description: string;
    status: string;
    technician_name: string;
};

const inputClass =
    "w-full min-h-12 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

const btnPrimaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-3 text-center text-base font-semibold hover:bg-slate-800 dark:hover:bg-white active:scale-98 transition-all md:w-auto cursor-pointer";

const btnSecondaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-3 text-center text-base font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 transition-all md:w-auto cursor-pointer";

const btnDangerClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 px-4 py-3 text-center text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 active:scale-98 transition-all md:w-auto cursor-pointer";

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
    const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const [clientName, setClientName] = useState("");
    const [address, setAddress] = useState("");
    const [machineSerial, setMachineSerial] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [technicianName, setTechnicianName] = useState("");

    useEffect(() => {
        async function fetchServiceCalls() {
            const { data, error } = await supabase
                .from("service_calls")
                .select("*")
                .order("id", { ascending: false });

            if (error) {
                alert(error.message);
                return;
            }

            setServiceCalls(data || []);
        }

        fetchServiceCalls();
    }, []);

    async function createServiceCall(e: React.FormEvent) {
        e.preventDefault();

        const { error } = await supabase.from("service_calls").insert({
            client_name: clientName,
            address,
            machine_serial: machineSerial,
            issue_description: issueDescription,
            status: "En attente",
            technician_name: technicianName,
        });

        if (error) {
            alert(error.message);
            return;
        }

        setClientName("");
        setAddress("");
        setMachineSerial("");
        setIssueDescription("");
        setTechnicianName("");
        setIsFormOpen(false);

        const { data } = await supabase
            .from("service_calls")
            .select("*")
            .order("id", { ascending: false });

        setServiceCalls(data || []);
    }

    async function updateStatus(id: number, status: string) {
        const { error } = await supabase
            .from("service_calls")
            .update({ status })
            .eq("id", id);

        if (error) {
            alert(error.message);
            return;
        }

        setServiceCalls((prev) =>
            prev.map((call) =>
                call.id === id
                    ? { ...call, status }
                    : call
            )
        );
    }

    const filteredCalls = serviceCalls.filter((call) =>
        call.client_name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    async function deleteServiceCall(id: number) {
        const confirmDelete = window.confirm(
            "Supprimer cet appel de service ?"
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("service_calls")
            .delete()
            .eq("id", id);

        if (error) {
            alert(error.message);
            return;
        }

        setServiceCalls((prev) =>
            prev.filter((call) => call.id !== id)
        );
    }

    return (
        <div className="w-full space-y-6 md:mx-auto md:max-w-4xl">
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

            {isFormOpen && (
                <form
                    onSubmit={createServiceCall}
                    className="w-full space-y-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-md animate-fade-in"
                >
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Créer une nouvelle fiche d'intervention
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom du client</label>
                            <input
                                className={inputClass}
                                placeholder="ex. Acme Corp"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technicien assigné</label>
                            <input
                                className={inputClass}
                                placeholder="ex. Jean Dupont"
                                value={technicianName}
                                onChange={(e) => setTechnicianName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Adresse</label>
                            <input
                                className={inputClass}
                                placeholder="ex. 123 rue de la Paix, Paris"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">N° série machine</label>
                            <input
                                className={inputClass}
                                placeholder="ex. SN-847291-X"
                                value={machineSerial}
                                onChange={(e) => setMachineSerial(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description du problème</label>
                        <textarea
                            className={`${inputClass} min-h-24 resize-y`}
                            placeholder="Décrivez précisément la panne signalée..."
                            value={issueDescription}
                            onChange={(e) => setIssueDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className={btnSecondaryClass}
                        >
                            Annuler
                        </button>
                        <button type="submit" className={btnPrimaryClass}>
                            Créer l’appel de service
                        </button>
                    </div>
                </form>
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

            <div className="grid gap-4 sm:grid-cols-2">
                {filteredCalls.length === 0 ? (
                    <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 dark:text-slate-400">Aucun appel de service trouvé.</p>
                    </div>
                ) : (
                    filteredCalls.map((call) => (
                        <article
                            key={call.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                        >
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
                                    onClick={() => deleteServiceCall(call.id)}
                                    className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 active:scale-95 transition-all cursor-pointer"
                                    aria-label="Supprimer l'appel"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
