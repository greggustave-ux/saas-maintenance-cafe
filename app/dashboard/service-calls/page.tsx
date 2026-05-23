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
    function getStatusColor(status: string) {
        switch (status) {
            case "En attente":
                return "bg-yellow-200 text-yellow-900";

            case "En cours":
                return "bg-blue-200 text-blue-900";

            case "Terminé":
                return "bg-green-200 text-green-900";

            default:
                return "bg-slate-200 text-slate-900";
        }
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
    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">
                Appels de service
            </h1>
            <input
                className="mb-6 w-full rounded-xl border p-3"
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <form
                onSubmit={createServiceCall}
                className="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow"
            >
                <input
                    className="rounded-lg border p-3"
                    placeholder="Nom du client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                />

                <input
                    className="rounded-lg border p-3"
                    placeholder="Adresse"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <input
                    className="rounded-lg border p-3"
                    placeholder="Numéro de série machine"
                    value={machineSerial}
                    onChange={(e) => setMachineSerial(e.target.value)}
                />

                <textarea
                    className="rounded-lg border p-3"
                    placeholder="Description du problème"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                />

                <input
                    className="rounded-lg border p-3"
                    placeholder="Technicien assigné"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                />

                <button className="rounded-lg bg-slate-950 p-3 font-semibold text-white">
                    Créer l’appel de service
                </button>
            </form>
            <div className="space-y-4">
                {filteredCalls.map((call) => (
                    <div
                        key={call.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                {call.client_name}
                            </h2>

                            <select
                                value={call.status}
                                onChange={(e) => updateStatus(call.id, e.target.value)}
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(call.status)}`}
                            >
                                <option>En attente</option>
                                <option>En cours</option>
                                <option>Terminé</option>
                            </select>
                        </div>

                        <p className="mt-2 text-slate-600">
                            {call.address}
                        </p>

                        <p className="mt-2">
                            <strong>Machine :</strong>{" "}
                            {call.machine_serial}
                        </p>

                        <p className="mt-2">
                            <strong>Problème :</strong>{" "}
                            {call.issue_description}
                        </p>

                        <p className="mt-2">
                            <strong>Technicien :</strong>{" "}
                            {call.technician_name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}