"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase-client";

type ServiceCall = {
    id: number;
    client_name: string;
    address: string;
    machine_serial: string;
    issue_description: string;
    status: string;
    technician_name: string;
    technician_notes: string | null;
};

export default function ServiceCallDetailsPage() {
    const params = useParams();
    const [serviceCall, setServiceCall] =
        useState<ServiceCall | null>(null);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        async function fetchServiceCall() {
            const { data, error } = await supabase
                .from("service_calls")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) {
                alert(error.message);
                return;
            }

            setServiceCall(data);
            setNotes(data.technician_notes || "");
        }

        fetchServiceCall();
    }, [params.id]);

    if (!serviceCall) {
        return <p className="p-8">Chargement...</p>;
    }
    async function saveNotes() {
        const { error } = await supabase
            .from("service_calls")
            .update({ technician_notes: notes })
            .eq("id", serviceCall?.id);

        if (error) {
            alert(error.message);
            return;
        }

        alert("Notes sauvegardées.");
    }

    return (
        <main className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow">
                <h1 className="text-3xl font-bold">
                    {serviceCall.client_name}
                </h1>

                <p className="mt-2 text-slate-600">
                    {serviceCall.address}
                </p>

                <div className="mt-6 space-y-4">
                    <p>
                        <strong>Machine :</strong>{" "}
                        {serviceCall.machine_serial}
                    </p>

                    <p>
                        <strong>Problème :</strong>{" "}
                        {serviceCall.issue_description}
                    </p>

                    <p>
                        <strong>Technicien :</strong>{" "}
                        {serviceCall.technician_name}
                    </p>

                    <p>
                        <strong>Statut :</strong>{" "}
                        {serviceCall.status}
                    </p>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h2 className="text-xl font-bold">
                            Notes technicien
                        </h2>

                        <textarea
                            className="mt-4 min-h-40 w-full rounded-lg border p-3"
                            placeholder="Ajouter les observations, actions effectuées, pièces à prévoir..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />

                        <button
                            onClick={saveNotes}
                            className="mt-4 rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white"
                        >
                            Sauvegarder les notes
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}