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
    "w-full min-h-12 rounded-lg border border-slate-400 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500";

const btnPrimaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-4 py-3 text-center text-base font-semibold text-white active:bg-slate-800 md:w-auto";

const btnDangerClass =
    "flex min-h-12 w-full items-center justify-center rounded-lg bg-red-100 px-4 py-3 text-center text-base font-semibold text-red-800 active:bg-red-200 md:w-auto";

function getStatusColor(status: string) {
    switch (status) {
        case "En attente":
            return "border border-yellow-400 bg-yellow-100 text-yellow-950";

        case "En cours":
            return "border border-blue-400 bg-blue-100 text-blue-950";

        case "Terminé":
            return "border border-green-400 bg-green-100 text-green-950";

        default:
            return "border border-slate-400 bg-slate-200 text-slate-900";
    }
}

export default function ServiceCallsPage() {
    const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
    const [search, setSearch] = useState("");
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
        <div className="w-full space-y-6 md:mx-auto md:max-w-3xl">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Appels de service
                </h1>
                <p className="mt-1 text-base text-slate-600">
                    Gérez vos interventions terrain
                </p>
            </header>

            <input
                className={inputClass}
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <form
                onSubmit={createServiceCall}
                className="w-full space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
                <h2 className="text-lg font-semibold text-slate-900">
                    Nouvel appel
                </h2>

                <input
                    className={inputClass}
                    placeholder="Nom du client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                />

                <input
                    className={inputClass}
                    placeholder="Adresse"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <input
                    className={inputClass}
                    placeholder="Numéro de série machine"
                    value={machineSerial}
                    onChange={(e) => setMachineSerial(e.target.value)}
                />

                <textarea
                    className={`${inputClass} min-h-32 resize-y`}
                    placeholder="Description du problème"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                />

                <input
                    className={inputClass}
                    placeholder="Technicien assigné"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                />

                <button type="submit" className={btnPrimaryClass}>
                    Créer l’appel de service
                </button>
            </form>

            <div className="space-y-5">
                {filteredCalls.map((call) => (
                    <article
                        key={call.id}
                        className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                        <div className="space-y-3">
                            <a
                                href={`/dashboard/service-calls/${call.id}`}
                                className="block text-xl font-bold leading-snug text-cyan-800 hover:underline"
                            >
                                {call.client_name}
                            </a>

                            <select
                                value={call.status}
                                onChange={(e) =>
                                    updateStatus(call.id, e.target.value)
                                }
                                aria-label={`Statut pour ${call.client_name}`}
                                className={`min-h-12 w-full max-w-full rounded-lg px-3 py-2 text-base font-semibold ${getStatusColor(call.status)}`}
                            >
                                <option>En attente</option>
                                <option>En cours</option>
                                <option>Terminé</option>
                            </select>
                        </div>

                        <dl className="mt-5 space-y-4 text-base">
                            <div>
                                <dt className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                    Adresse
                                </dt>
                                <dd className="mt-1 break-words text-slate-800">
                                    {call.address}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                    N° série machine
                                </dt>
                                <dd className="mt-1 break-words text-slate-800">
                                    {call.machine_serial}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                    Problème
                                </dt>
                                <dd className="mt-1 break-words text-slate-800">
                                    {call.issue_description}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                    Technicien
                                </dt>
                                <dd className="mt-1 break-words text-slate-800">
                                    {call.technician_name}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-6 flex flex-col gap-3">
                            <a
                                href={`/dashboard/service-calls/${call.id}`}
                                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-cyan-700 px-4 py-3 text-center text-base font-semibold text-white active:bg-cyan-800"
                            >
                                Ouvrir la fiche
                            </a>
                            <button
                                type="button"
                                onClick={() => deleteServiceCall(call.id)}
                                className={btnDangerClass}
                            >
                                Supprimer
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
