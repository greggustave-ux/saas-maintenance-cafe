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
};

export default function ServiceCallDetailsPage() {
    const params = useParams();
    const [serviceCall, setServiceCall] =
        useState<ServiceCall | null>(null);

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
        }

        fetchServiceCall();
    }, [params.id]);

    if (!serviceCall) {
        return <p className="p-8">Chargement...</p>;
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
                </div>
            </div>
        </main>
    );
}