"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase-client";
import SignatureCanvas from "react-signature-canvas";
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

const inputClass =
    "w-full min-h-12 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

const btnPrimaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-3 text-center text-base font-semibold hover:bg-slate-800 dark:hover:bg-white active:scale-98 transition-all md:w-auto cursor-pointer shadow-xs";

const btnSecondaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-3 text-center text-base font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 transition-all md:w-auto cursor-pointer";

const btnDangerClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 active:scale-98 transition-all cursor-pointer";

const sectionCardClass =
    "w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6 space-y-4";

export default function ServiceCallDetailsPage() {
    const params = useParams();
    const [serviceCall, setServiceCall] = useState<ServiceCall | null>(null);
    const [notes, setNotes] = useState("");
    const [parts, setParts] = useState<ServiceCallPart[]>([]);
    const [partName, setPartName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [photos, setPhotos] = useState<ServiceCallPhoto[]>([]);
    const [savingSignature, setSavingSignature] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

    const signatureRef = useRef<any>(null);

    async function fetchParts() {
        try {
            const { data, error } = await supabase
                .from("service_call_parts")
                .select("*")
                .eq("service_call_id", params.id)
                .order("id", { ascending: false });

            if (error) throw error;
            setParts(data || []);
        } catch (err: any) {
            alert(err.message || "Erreur lors de la récupération des pièces.");
        }
    }

    async function fetchPhotos() {
        try {
            const { data, error } = await supabase
                .from("service_call_photos")
                .select("*")
                .eq("service_call_id", params.id)
                .order("id", { ascending: false });

            if (error) throw error;
            setPhotos(data || []);
        } catch (err: any) {
            alert(err.message || "Erreur lors de la récupération des photos.");
        }
    }

    useEffect(() => {
        async function fetchServiceCall() {
            try {
                const { data, error } = await supabase
                    .from("service_calls")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (error) throw error;
                setServiceCall(data);
                setNotes(data.technician_notes || "");
            } catch (err: any) {
                alert(err.message || "Erreur lors de la récupération de l'appel.");
            }
        }

        fetchServiceCall();
        fetchParts();
        fetchPhotos();
    }, [params.id]);

    // Handle Responsive Signature Pad resize with device pixel ratio
    useEffect(() => {
        if (!serviceCall) return;

        function resizeCanvas() {
            const canvas = signatureRef.current?.getCanvas();
            if (canvas) {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                const width = canvas.offsetWidth;
                const height = canvas.offsetHeight;
                
                if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
                    const data = signatureRef.current?.toDataURL();
                    canvas.width = width * ratio;
                    canvas.height = height * ratio;
                    canvas.getContext("2d")?.scale(ratio, ratio);
                    signatureRef.current?.clear();
                    
                    if (data && !signatureRef.current?.isEmpty()) {
                        const img = new Image();
                        img.onload = () => {
                            canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
                        };
                        img.src = data;
                    }
                }
            }
        }

        // Delay slightly for render cycles
        const timer = setTimeout(resizeCanvas, 300);
        window.addEventListener("resize", resizeCanvas);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [serviceCall]);

    if (!serviceCall) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-cyan-500" />
                <p className="text-base text-slate-500 dark:text-slate-400">Chargement de la fiche d'intervention...</p>
            </div>
        );
    }

    async function saveNotes() {
        try {
            const { error } = await supabase
                .from("service_calls")
                .update({ technician_notes: notes })
                .eq("id", serviceCall?.id);

            if (error) throw error;
            alert("Notes sauvegardées.");
        } catch (err: any) {
            alert(err.message || "Erreur lors de l'enregistrement des notes.");
        }
    }

    async function addPart(e: React.FormEvent) {
        e.preventDefault();
        if (!serviceCall) return;

        try {
            const { error } = await supabase
                .from("service_call_parts")
                .insert({
                    service_call_id: serviceCall.id,
                    part_name: partName,
                    quantity,
                    unit_price: unitPrice,
                });

            if (error) throw error;
            
            setPartName("");
            setQuantity(1);
            setUnitPrice(0);
            fetchParts();
        } catch (err: any) {
            alert(err.message || "Erreur lors de l'ajout de la pièce.");
        }
    }

    const totalPartsCost = parts.reduce(
        (total, part) => total + part.quantity * (part.unit_price || 0),
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

            if (storageError) throw storageError;

            const { data } = supabase.storage
                .from("service-photos")
                .getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from("service_call_photos")
                .insert({
                    service_call_id: serviceCall.id,
                    photo_url: data.publicUrl,
                });

            if (insertError) throw insertError;

            await fetchPhotos();
        } catch (err: any) {
            setUploadError(err.message || "Échec du téléversement. Réessayez.");
        } finally {
            setUploading(false);
            input.value = "";
        }
    }

    async function deletePhoto(photoId: number, photoUrl: string) {
        const confirmDelete = window.confirm("Supprimer cette photo ?");
        if (!confirmDelete) return;

        try {
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

            if (error) throw error;

            setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
        } catch (err: any) {
            alert(err.message || "Impossible de supprimer la photo.");
        }
    }

    async function handleSaveSignature() {
        if (!signatureRef.current || !serviceCall) return;

        if (signatureRef.current.isEmpty()) {
            alert("La signature est vide.");
            return;
        }

        setSavingSignature(true);

        try {
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

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("service-photos")
                .getPublicUrl(filePath);

            const publicUrl = data.publicUrl;

            const { error: updateError } = await supabase
                .from("service_calls")
                .update({ signature_url: publicUrl })
                .eq("id", serviceCall.id);

            if (updateError) throw updateError;

            setServiceCall({
                ...serviceCall,
                signature_url: publicUrl,
            });
            alert("Signature enregistrée avec succès.");
        } catch (err: any) {
            alert(err.message || "Erreur lors de la sauvegarde de la signature.");
        } finally {
            setSavingSignature(false);
        }
    }

    function clearSignature() {
        signatureRef.current?.clear();
    }

    async function downloadPdf() {
        const element = document.getElementById("pdf-print-template");
        if (!element) return;

        setGeneratingPdf(true);

        try {
            // Momentarily display the hidden component or render from it
            element.style.display = "block";

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            element.style.display = "none";

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
        } catch (err: any) {
            console.error(err);
            alert("Impossible de générer le PDF. Les images n'ont peut-être pas des permissions CORS valides.");
        } finally {
            setGeneratingPdf(false);
        }
    }

    return (
        <main className="w-full space-y-6 md:mx-auto md:max-w-4xl">
            {/* Header / Actions bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="space-y-1">
                    <a href="/dashboard/service-calls" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour aux appels
                    </a>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Intervention #{serviceCall.id}
                    </h1>
                </div>

                <button
                    type="button"
                    disabled={generatingPdf}
                    onClick={downloadPdf}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 px-6 py-3 text-base font-semibold text-white hover:bg-cyan-700 dark:hover:bg-cyan-400 active:scale-98 transition-all md:w-auto shadow-xs cursor-pointer disabled:opacity-50"
                >
                    {generatingPdf ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Génération...
                        </>
                    ) : (
                        <>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Télécharger le PDF
                        </>
                    )}
                </button>
            </div>

            {/* Content panels */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left side: details card */}
                <div className="md:col-span-1 space-y-6">
                    <section className={sectionCardClass}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Client</h2>
                            <span className="inline-flex rounded-full bg-cyan-100 dark:bg-cyan-950/40 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:text-cyan-400 border border-cyan-200/30">
                                {serviceCall.status}
                            </span>
                        </div>
                        
                        <div className="space-y-4 pt-1">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    {serviceCall.client_name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 break-words">
                                    {serviceCall.address}
                                </p>
                            </div>

                            <dl className="grid gap-3.5 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-sm">
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Code machine</dt>
                                    <dd className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200 break-all">{serviceCall.machine_serial || "—"}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technicien terrain</dt>
                                    <dd className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200">{serviceCall.technician_name || "Non assigné"}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description du problème</dt>
                                    <dd className="mt-1 text-slate-600 dark:text-slate-350 leading-relaxed break-words">{serviceCall.issue_description}</dd>
                                </div>
                            </dl>
                        </div>
                    </section>
                </div>

                {/* Right side: technician updates */}
                <div className="md:col-span-2 space-y-6">
                    {/* Notes Section */}
                    <section className={sectionCardClass}>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                            Notes d'intervention
                        </h2>
                        <textarea
                            className={`${inputClass} min-h-32 resize-y text-base`}
                            placeholder="Ajouter des observations, actions effectuées, pièces à prévoir lors de la visite..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={saveNotes}
                            className={`${btnPrimaryClass} w-full`}
                        >
                            Sauvegarder les notes
                        </button>
                    </section>

                    {/* Photos Section */}
                    <section className={sectionCardClass}>
                        <div className="flex items-center justify-between pb-1">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                                Photos de l'intervention
                            </h2>
                            <span className="text-xs text-slate-400">{photos.length} photo(s)</span>
                        </div>

                        <div className="flex flex-col gap-4">
                            <label
                                className={`flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-center text-base font-semibold text-white shadow-xs transition-all ${
                                    uploading
                                        ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700 opacity-60"
                                        : "cursor-pointer bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-white active:scale-98"
                                }`}
                            >
                                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {uploading ? "Téléversement en cours..." : "Prendre / Ajouter une photo"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={uploadPhoto}
                                    disabled={uploading}
                                    className="sr-only"
                                />
                            </label>

                            {uploadError && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3.5 text-sm text-red-600 dark:text-red-400" role="alert">
                                    {uploadError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
                                {photos.map((photo) => (
                                    <div
                                        key={photo.id}
                                        className="group relative overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-850 p-2 shadow-xs"
                                    >
                                        <div 
                                            className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 cursor-pointer"
                                            onClick={() => setActivePhotoModal(photo.photo_url)}
                                        >
                                            <img
                                                src={photo.photo_url}
                                                alt="Aperçu de l'intervention"
                                                crossOrigin="anonymous"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => deletePhoto(photo.id, photo.photo_url)}
                                            className={`${btnDangerClass} mt-2 w-full min-h-10 text-sm py-2`}
                                        >
                                            Supprimer la photo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Signature Section */}
                    <section className={sectionCardClass}>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                            Signature client
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Veuillez faire signer le client ci-dessous pour valider la fin de l'intervention :
                        </p>

                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            <SignatureCanvas
                                ref={signatureRef}
                                penColor="black"
                                canvasProps={{
                                    className: "h-36 w-full touch-none sm:h-44",
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleSaveSignature}
                                disabled={savingSignature}
                                className={`${btnPrimaryClass} flex-1`}
                            >
                                {savingSignature ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    "Enregistrer la signature"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={clearSignature}
                                className={btnSecondaryClass}
                            >
                                Effacer
                            </button>
                        </div>

                        {serviceCall.signature_url && (
                            <div className="mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Signature validée :
                                </p>
                                <div className="inline-block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-2">
                                    <img
                                        src={serviceCall.signature_url}
                                        alt="Signature client"
                                        crossOrigin="anonymous"
                                        className="h-16 w-auto object-contain sm:h-20"
                                    />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Parts Section */}
                    <section className={sectionCardClass}>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                            Pièces utilisées
                        </h2>

                        <form onSubmit={addPart} className="grid gap-3.5 sm:grid-cols-3 sm:items-end">
                            <div className="space-y-1 sm:col-span-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom de la pièce</label>
                                <input
                                    className={inputClass}
                                    placeholder="ex. Joint torique"
                                    value={partName}
                                    onChange={(e) => setPartName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quantité</label>
                                <input
                                    type="number"
                                    min="1"
                                    className={inputClass}
                                    placeholder="Quantité"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Prix unitaire ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={inputClass}
                                    placeholder="ex. 12.50"
                                    value={unitPrice || ""}
                                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="sm:col-span-3 pt-2">
                                <button type="submit" className={`${btnPrimaryClass} w-full`}>
                                    Ajouter la pièce
                                </button>
                            </div>
                        </form>

                        <div className="mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2.5">
                            {parts.length === 0 ? (
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">Aucune pièce répertoriée.</p>
                            ) : (
                                parts.map((part) => (
                                    <div
                                        key={part.id}
                                        className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/30 dark:border-slate-800/40 p-4"
                                    >
                                        <div className="space-y-0.5">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {part.part_name}
                                            </span>
                                            <p className="text-xs text-slate-400">
                                                Prix unitaire : ${(part.unit_price || 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 dark:text-white">
                                                x{part.quantity}
                                            </p>
                                            <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                                                ${(part.quantity * (part.unit_price || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}

                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 font-bold text-lg text-slate-900 dark:text-white">
                                <span>Coût total pièces</span>
                                <span className="text-cyan-600 dark:text-cyan-400">${totalPartsCost.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Photo preview modal */}
            {activePhotoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4" onClick={() => setActivePhotoModal(null)}>
                    <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-slate-900 border border-white/10" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/70 text-white hover:bg-slate-900 cursor-pointer"
                            onClick={() => setActivePhotoModal(null)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={activePhotoModal}
                            alt="Aperçu plein écran"
                            className="w-full h-auto max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Hidden Off-Screen print template for clean A4 PDF layouts */}
            <div
                id="pdf-print-template"
                style={{
                    display: "none",
                    position: "absolute",
                    left: "-9999px",
                    width: "794px", // A4 pixel width at 96 DPI
                    color: "#0f172a",
                    backgroundColor: "#ffffff",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div style={{ padding: "40px" }} className="space-y-8">
                    {/* Brand header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px" }}>
                        <div>
                            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#0891b2", margin: 0 }}>RAPPORT D'INTERVENTION</h1>
                            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px", marginBottom: 0 }}>Plateforme Welo • SME Field Operations</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a" }}>Fiche #00{serviceCall.id}</span>
                            <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Statut: {serviceCall.status}</p>
                        </div>
                    </div>

                    {/* Client & Machine info */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px" }}>
                        <div>
                            <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", margin: "0 0 6px 0" }}>Client & Adresse</h3>
                            <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 4px 0" }}>{serviceCall.client_name}</p>
                            <p style={{ fontSize: "14px", color: "#334155", margin: 0, lineHeight: "1.4" }}>{serviceCall.address}</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", margin: "0 0 6px 0" }}>Informations Équipement</h3>
                            <table style={{ width: "100%", fontSize: "14px", borderCollapse: "collapse" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: "4px 0", color: "#64748b" }}>Code Série Machine :</td>
                                        <td style={{ padding: "4px 0", fontWeight: "bold", textAlign: "right" }}>{serviceCall.machine_serial || "—"}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "4px 0", color: "#64748b" }}>Technicien Assigné :</td>
                                        <td style={{ padding: "4px 0", fontWeight: "bold", textAlign: "right" }}>{serviceCall.technician_name || "—"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Issue Description */}
                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", backgroundColor: "#f8fafc" }}>
                        <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", margin: "0 0 8px 0" }}>Panne / Problème Signalé</h4>
                        <p style={{ fontSize: "14px", color: "#0f172a", margin: 0, lineHeight: "1.5" }}>{serviceCall.issue_description}</p>
                    </div>

                    {/* Technician Notes */}
                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px" }}>
                        <h4 style={{ fontSize: "12px", textTransform: "uppercase", color: "#64748b", margin: "0 0 8px 0" }}>Observations & Travaux Réalisés</h4>
                        <p style={{ fontSize: "14px", color: "#0f172a", margin: 0, lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                            {serviceCall.technician_notes || "Aucune note consignée par le technicien."}
                        </p>
                    </div>

                    {/* Parts Table */}
                    <div>
                        <h4 style={{ fontSize: "14px", textTransform: "uppercase", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", margin: "0 0 10px 0" }}>Pièces et fournitures utilisées</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                                    <th style={{ textAlign: "left", padding: "10px 0", color: "#64748b" }}>Nom de la pièce</th>
                                    <th style={{ textAlign: "center", padding: "10px 0", color: "#64748b" }}>Quantité</th>
                                    <th style={{ textAlign: "right", padding: "10px 0", color: "#64748b" }}>Prix unitaire</th>
                                    <th style={{ textAlign: "right", padding: "10px 0", color: "#64748b" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: "16px 0", textAlign: "center", color: "#64748b" }}>Aucune pièce utilisée lors de cette visite.</td>
                                    </tr>
                                ) : (
                                    parts.map((part) => (
                                        <tr key={part.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "10px 0", fontWeight: "bold" }}>{part.part_name}</td>
                                            <td style={{ padding: "10px 0", textAlign: "center" }}>{part.quantity}</td>
                                            <td style={{ padding: "10px 0", textAlign: "right" }}>${(part.unit_price || 0).toFixed(2)}</td>
                                            <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold" }}>${(part.quantity * (part.unit_price || 0)).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div style={{ textAlign: "right", marginTop: "16px" }}>
                            <span style={{ fontSize: "16px", fontWeight: "bold" }}>Total Facturation Pièces : ${(totalPartsCost || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Photos Preview */}
                    {photos.length > 0 && (
                        <div>
                            <h4 style={{ fontSize: "14px", textTransform: "uppercase", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", margin: "0 0 12px 0" }}>Photos Jointes</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                {photos.slice(0, 4).map((p) => (
                                    <div key={p.id} style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px" }}>
                                        <img src={p.photo_url} alt="Intervention" crossOrigin="anonymous" style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "4px" }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Signature block */}
                    {serviceCall.signature_url && (
                        <div style={{ marginTop: "40px", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <div style={{ textAlign: "center", width: "250px" }}>
                                    <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px 0" }}>Bon pour accord - Signature du client</p>
                                    <div style={{ border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px", backgroundColor: "#f8fafc" }}>
                                        <img src={serviceCall.signature_url} alt="Signature" crossOrigin="anonymous" style={{ height: "60px", width: "auto", margin: "0 auto", display: "block" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}