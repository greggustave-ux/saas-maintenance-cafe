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
    photo_url: string | null;
};
type ServiceCallPart = {
    id: number;
    service_call_id: number;
    part_name: string;
    quantity: number;
    unit_price: number;
};

export default function ServiceCallDetailsPage() {
    const params = useParams();
    const [serviceCall, setServiceCall] =
        useState<ServiceCall | null>(null);
    const [notes, setNotes] = useState("");
    const [parts, setParts] = useState<ServiceCallPart[]>([]);
    const [partName, setPartName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [uploading, setUploading] = useState(false);

    async function fetchParts() {
        const { data, error } = await supabase
            .from("service_call_parts")
            .select("*")
            .eq("service_call_id", params.id)
            .order("id", { ascending: false });

        if (error) {
            alert(error.message);
            return;
        }

        setParts(data || []);
    }

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
        fetchParts();
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
    async function addPart(e: React.FormEvent) {
        e.preventDefault();

        if (!serviceCall) return;

        const { error } = await supabase
            .from("service_call_parts")
            .insert({
                service_call_id: serviceCall.id,
                part_name: partName,
                quantity,
            });

        if (error) {
            alert(error.message);
            return;
        }

        setPartName("");
        setQuantity(1);
        fetchParts();
    }

    <input
        type="number"
        step="0.01"
        className="rounded-lg border p-3"
        placeholder="Prix unitaire"
        value={unitPrice}
        onChange={(e) =>
            setUnitPrice(Number(e.target.value))
        }
    />
    const totalPartsCost = parts.reduce(
        (total, part) =>
            total + part.quantity * part.unit_price,
        0
    );

    async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || !serviceCall) return;

        const file = e.target.files[0];
        console.log("Fichier sélectionné :", file);

        setUploading(true);

        const safeFileName = file.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9.-]/g, "_");

        const filePath = `${serviceCall.id}/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
            .from("service-photos")
            .upload(filePath, file, {
                upsert: true,
            });

        console.log("Erreur upload :", uploadError);

        if (uploadError) {
            alert(uploadError.message);
            setUploading(false);
            return;
        }

        const { data } = supabase.storage
            .from("service-photos")
            .getPublicUrl(filePath);

        console.log("URL publique :", data);

        const publicUrl = data.publicUrl;

        const { error: updateError } = await supabase
            .from("service_calls")
            .update({ photo_url: publicUrl })
            .eq("id", serviceCall.id);

        if (updateError) {
            alert(updateError.message);
            setUploading(false);
            return;
        }

        setServiceCall({
            ...serviceCall,
            photo_url: publicUrl,
        });

        setUploading(false);
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
                        <div className="rounded-xl bg-white p-6 shadow">
                            <h2 className="text-xl font-bold">
                                Photo intervention
                            </h2>
                            <label className="mt-4 inline-block cursor-pointer rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white">
                                Ajouter une photo

                                <div className="rounded-xl bg-white p-6 shadow">
                                    <h2 className="text-xl font-bold">
                                        Photo intervention
                                    </h2>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadPhoto}
                                        className="mt-4 block w-full rounded-lg border p-3"
                                    />

                                    {uploading && (
                                        <p className="mt-4 text-sm text-slate-500">
                                            Upload en cours...
                                        </p>
                                    )}

                                    {serviceCall.photo_url && (
                                        <img
                                            src={serviceCall.photo_url}
                                            alt="Intervention"
                                            className="mt-6 max-w-md rounded-xl border"
                                        />
                                    )}
                                </div>
                            </label>

                        </div>
                        <div className="rounded-xl bg-white p-6 shadow">
                            <h2 className="text-xl font-bold">
                                Pièces utilisées
                            </h2>

                            <form onSubmit={addPart} className="mt-4 grid gap-4">
                                <input
                                    className="rounded-lg border p-3"
                                    placeholder="Nom de la pièce"
                                    value={partName}
                                    onChange={(e) => setPartName(e.target.value)}
                                />

                                <input
                                    type="number"
                                    min="1"
                                    className="rounded-lg border p-3"
                                    placeholder="Quantité"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />

                                <button className="rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white">
                                    Ajouter une pièce
                                </button>
                            </form>

                            <div className="mt-6 space-y-3">
                                {parts.map((part) => (
                                    <div
                                        key={part.id}
                                        className="flex justify-between rounded-lg bg-slate-100 p-3"
                                    >
                                        <span>{part.part_name}</span>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                x{part.quantity}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                ${(part.quantity * part.unit_price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-6 border-t pt-4 text-right">
                                    <p className="text-lg font-bold">
                                        Total pièces : $
                                        {totalPartsCost.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
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