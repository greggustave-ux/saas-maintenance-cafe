"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase-client";
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { compressImageForUpload } from "@/src/lib/compress-image";

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
    signature_url: string | null;
};
type ServiceCallPart = {
    id: number;
    service_call_id: number;
    part_name: string;
    quantity: number;
    unit_price: number;
};
type ServiceCallPhoto = {
    id: number;
    photo_url: string;
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
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [photos, setPhotos] = useState<ServiceCallPhoto[]>([]);
    const signatureRef = useRef<any>(null);
    const [savingSignature, setSavingSignature] = useState(false);

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
        fetchPhotos();
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
        const input = e.target;
        const file = input.files?.[0];

        if (!file || !serviceCall) return;

        setUploadError(null);
        setUploading(true);

        try {
            const compressed = await compressImageForUpload(file);
            const filePath = `${serviceCall.id}/${Date.now()}-photo.jpg`;

            const { error: storageError } = await supabase.storage
                .from("service-photos")
                .upload(filePath, compressed, {
                    upsert: true,
                    contentType: "image/jpeg",
                });

            if (storageError) {
                setUploadError(storageError.message);
                return;
            }

            const { data } = supabase.storage
                .from("service-photos")
                .getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from("service_call_photos")
                .insert({
                    service_call_id: serviceCall.id,
                    photo_url: data.publicUrl,
                });

            if (insertError) {
                setUploadError(insertError.message);
                return;
            }

            await fetchPhotos();
        } catch (err) {
            setUploadError(
                err instanceof Error
                    ? err.message
                    : "Échec du téléversement. Réessayez."
            );
        } finally {
            setUploading(false);
            input.value = "";
        }
    }
    async function fetchPhotos() {
        const { data, error } = await supabase
            .from("service_call_photos")
            .select("*")
            .eq("service_call_id", params.id)
            .order("id", { ascending: false });

        if (error) {
            alert(error.message);
            return;
        }

        setPhotos(data || []);
    }
    async function deletePhoto(photoId: number, photoUrl: string) {
        const confirmDelete = window.confirm("Supprimer cette photo ?");
        if (!confirmDelete) return;

        const path = photoUrl.split("/service-photos/")[1];

        if (path) {
            await supabase.storage
                .from("service-photos")
                .remove([path]);
        }

        const { error } = await supabase
            .from("service_call_photos")
            .delete()
            .eq("id", photoId);

        if (error) {
            alert(error.message);
            return;
        }

        setPhotos((prev) =>
            prev.filter((photo) => photo.id !== photoId)
        );
    }
    async function saveSignature() {
        if (!signatureRef.current || !serviceCall) return;

        if (signatureRef.current.isEmpty()) {
            alert("La signature est vide.");
            return;
        }

        setSavingSignature(true);

        const dataUrl = signatureRef.current
            .getTrimmedCanvas()
            .toDataURL("image/png");

        const blob = await fetch(dataUrl).then((res) => res.blob());

        const filePath = `${serviceCall.id}/signature-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
            .from("service-photos")
            .upload(filePath, blob, {
                contentType: "image/png",
                upsert: true,
            });

        if (uploadError) {
            alert(uploadError.message);
            setSavingSignature(false);
            return;
        }

        const { data } = supabase.storage
            .from("service-photos")
            .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        const { error: updateError } = await supabase
            .from("service_calls")
            .update({ signature_url: publicUrl })
            .eq("id", serviceCall.id);

        if (updateError) {
            alert(updateError.message);
            setSavingSignature(false);
            return;
        }

        setServiceCall({
            ...serviceCall,
            signature_url: publicUrl,
        });

        setSavingSignature(false);
    }
    function clearSignature() {
        signatureRef.current?.clear();
    }
    async function downloadPdf() {
        const element = document.getElementById("service-report");

        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`rapport-intervention-${serviceCall?.id}.pdf`);
        } catch (err) {
            console.error(err);
            alert("Impossible de générer le PDF. Voir la console pour plus de détails.");
        }
    }

    return (
        <main className="space-y-6">
            <button
                type="button"
                onClick={downloadPdf}
                className="relative z-20 mb-6 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-700"
            >
                Télécharger le rapport PDF
            </button>
            <div id="service-report" className="space-y-6">
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

                                <label
                                    className={`mt-4 inline-block rounded-lg px-4 py-2 font-semibold text-white ${
                                        uploading
                                            ? "cursor-not-allowed bg-slate-400 opacity-70"
                                            : "cursor-pointer bg-slate-950 hover:bg-slate-800"
                                    }`}
                                >
                                    {uploading
                                        ? "Téléversement…"
                                        : "Ajouter une photo"}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadPhoto}
                                        disabled={uploading}
                                        className="sr-only"
                                    />
                                </label>

                                {uploading && (
                                    <div className="mt-4" aria-live="polite">
                                        <p className="text-sm font-medium text-slate-700">
                                            Téléversement en cours…
                                        </p>
                                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-full w-full animate-pulse rounded-full bg-cyan-600" />
                                        </div>
                                    </div>
                                )}

                                {uploadError && (
                                    <p
                                        className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                                        role="alert"
                                    >
                                        {uploadError}
                                    </p>
                                )}

                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {photos.map((photo) => (
                                        <div
                                            key={photo.id}
                                            className="relative rounded-xl border bg-white p-3"
                                        >
                                            <img
                                                src={photo.photo_url}
                                                alt="Intervention"
                                                crossOrigin="anonymous"
                                                className="mb-3 w-full rounded-lg object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    deletePhoto(
                                                        photo.id,
                                                        photo.photo_url
                                                    )
                                                }
                                                disabled={uploading}
                                                className="relative z-10 w-full rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-xl bg-white p-6 shadow">
                                <h2 className="text-xl font-bold">
                                    Signature client
                                </h2>

                                <div className="mt-4 rounded-xl border bg-white">
                                    <SignatureCanvas
                                        ref={signatureRef}
                                        penColor="black"
                                        canvasProps={{
                                            className: "h-48 w-full rounded-xl",
                                        }}
                                    />
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={saveSignature}
                                        className="rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white"
                                    >
                                        {savingSignature ? "Sauvegarde..." : "Sauvegarder la signature"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-800"
                                    >
                                        Effacer
                                    </button>
                                </div>

                                {serviceCall.signature_url && (
                                    <div className="mt-6">
                                        <p className="mb-2 text-sm font-semibold text-slate-600">
                                            Signature enregistrée :
                                        </p>

                                        <img
                                            src={serviceCall.signature_url}
                                            alt="Signature client"
                                            crossOrigin="anonymous"
                                            className="max-w-sm rounded-xl border"
                                        />
                                    </div>
                                )}
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
            </div>
        </main>
    );
}