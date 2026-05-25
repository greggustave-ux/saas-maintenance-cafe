"use client";

import { useParams } from "next/navigation";
import { useServiceCallDetails } from "@/src/modules/service_calls/hooks";
import PartsSection from "@/src/modules/service_calls/components/PartsSection";
import SignatureSection from "@/src/modules/service_calls/components/SignatureSection";
import PhotosSection from "@/src/modules/service_calls/components/PhotosSection";
import MachineHistorySection from "@/src/modules/service_calls/components/MachineHistorySection";

const inputClass =
    "w-full min-h-12 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

const btnPrimaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-3 text-center text-base font-semibold hover:bg-slate-800 dark:hover:bg-white active:scale-98 transition-all md:w-auto cursor-pointer shadow-xs";

const sectionCardClass =
    "w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6 space-y-4";

function ServiceCallDetailsSkeleton() {
    return (
        <div className="w-full space-y-6 md:mx-auto md:max-w-4xl animate-pulse">
            {/* Header skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="space-y-2 w-full max-w-xs">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-8 w-48 bg-slate-250 dark:bg-slate-750 rounded" />
                </div>
                <div className="h-12 w-full sm:w-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>

            {/* Content panels skeleton */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left column skeleton */}
                <div className="md:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-3 w-12 bg-slate-250 dark:bg-slate-755 rounded" />
                            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-850 rounded-full" />
                        </div>
                        <div className="space-y-4 pt-1">
                            <div>
                                <div className="h-6 w-32 bg-slate-250 dark:bg-slate-755 rounded" />
                                <div className="mt-2 h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-4">
                                <div>
                                    <div className="h-3 w-24 bg-slate-250 dark:bg-slate-755 rounded" />
                                    <div className="mt-1.5 h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                                <div>
                                    <div className="h-3 w-28 bg-slate-250 dark:bg-slate-755 rounded" />
                                    <div className="mt-1.5 h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                                </div>
                                <div>
                                    <div className="h-3 w-32 bg-slate-250 dark:bg-slate-755 rounded" />
                                    <div className="mt-2 h-16 w-full bg-slate-150 dark:bg-slate-850 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Machine History Skeleton */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                            <div className="space-y-2">
                                <div className="h-5 w-36 bg-slate-250 dark:bg-slate-755 rounded" />
                                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        </div>
                        <div className="space-y-4 pt-2">
                            <div className="flex gap-4">
                                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-32 bg-slate-250 dark:bg-slate-755 rounded" />
                                    <div className="h-3 w-full bg-slate-150 dark:bg-slate-850 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column skeleton */}
                <div className="md:col-span-2 space-y-6">
                    {/* Notes Section skeleton */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 space-y-4">
                        <div className="h-6 w-40 bg-slate-250 dark:bg-slate-750 rounded" />
                        <div className="h-32 w-full bg-slate-150 dark:bg-slate-850 rounded-xl" />
                        <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    </div>

                    {/* Photos Section skeleton */}
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-44 bg-slate-250 dark:bg-slate-750 rounded" />
                            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-850 rounded" />
                        </div>
                        <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
                            <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-2 space-y-2">
                                <div className="aspect-4/3 w-full bg-slate-150 dark:bg-slate-855 rounded-lg" />
                                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
                            </div>
                            <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-2 space-y-2">
                                <div className="aspect-4/3 w-full bg-slate-150 dark:bg-slate-855 rounded-lg" />
                                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServiceCallDetailsPage() {
    const params = useParams();
    const id = Number(params.id);

    const {
        serviceCall,
        notes,
        setNotes,
        parts,
        photos,
        loading,
        error,
        uploadStatus,
        uploadError,
        savingSignature,
        generatingPdf,
        activePhotoModal,
        setActivePhotoModal,
        partsForm,
        totalPartsCost,
        handleSaveNotes,
        handleAddPart,
        handleUploadPhoto,
        handleDeletePhoto,
        handleSaveSignature,
        handleDownloadPdf,
        successMessage,
        machineHistory,
        machineHistoryLoading,
    } = useServiceCallDetails(id);

    if (loading) {
        return <ServiceCallDetailsSkeleton />;
    }

    if (error || !serviceCall) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3 text-center p-4 animate-fadeIn">
                <div className="rounded-full bg-red-100 dark:bg-red-955/20 p-3 text-red-600 dark:text-red-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Une erreur est survenue</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">{error || "Intervention introuvable."}</p>
                <a href="/dashboard/service-calls" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                    Retour aux appels de service
                </a>
            </div>
        );
    }

    return (
        <main className="w-full space-y-6 md:mx-auto md:max-w-4xl animate-fadeIn">
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
                    onClick={() => handleDownloadPdf("pdf-print-template")}
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

            {successMessage && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 text-sm text-emerald-600 dark:text-emerald-400 animate-fadeIn" role="alert">
                    {successMessage}
                </div>
            )}

            {/* Content panels */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left side: details card & machine history */}
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

                    {serviceCall.machine_serial && (
                        <MachineHistorySection
                            machineHistory={machineHistory}
                            currentCallId={serviceCall.id}
                            machineHistoryLoading={machineHistoryLoading}
                        />
                    )}
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
                            onClick={handleSaveNotes}
                            className={`${btnPrimaryClass} w-full`}
                        >
                            Sauvegarder les notes
                        </button>
                    </section>

                    {/* Photos Section */}
                    <PhotosSection
                        photos={photos}
                        uploadStatus={uploadStatus}
                        uploadError={uploadError}
                        handleUploadPhoto={handleUploadPhoto}
                        handleDeletePhoto={handleDeletePhoto}
                        setActivePhotoModal={setActivePhotoModal}
                    />

                    {/* Signature Section */}
                    <SignatureSection
                        serviceCall={serviceCall}
                        savingSignature={savingSignature}
                        handleSaveSignature={handleSaveSignature}
                    />

                    {/* Parts Section */}
                    <PartsSection
                        parts={parts}
                        partsForm={partsForm}
                        handleAddPart={handleAddPart}
                        totalPartsCost={totalPartsCost}
                        loading={false}
                    />
                </div>
            </div>

            {/* Photo preview modal */}
            {activePhotoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn" onClick={() => setActivePhotoModal(null)}>
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
                                        <img 
                                            src={p.photo_url} 
                                            alt="Intervention" 
                                            crossOrigin="anonymous" 
                                            style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "4px" }} 
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                        />
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
                                        <img 
                                            src={serviceCall.signature_url} 
                                            alt="Signature" 
                                            crossOrigin="anonymous" 
                                            style={{ height: "60px", width: "auto", margin: "0 auto", display: "block" }} 
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                        />
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