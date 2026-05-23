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

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold">
                Appels de service
            </h1>

            <div className="space-y-4">
                {serviceCalls.map((call) => (
                    <div
                        key={call.id}
                        className="rounded-xl bg-white p-6 shadow"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                {call.client_name}
                            </h2>

                            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm">
                                {call.status}
                            </span>
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