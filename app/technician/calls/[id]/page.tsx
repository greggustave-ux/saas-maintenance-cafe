"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServiceCallDetails } from "@/src/modules/service_calls/hooks";
import { DSBadge } from "@/src/design-system/components/DSBadge";
import { DSCard } from "@/src/design-system/components/DSCard";
import DSMobilePage from "@/src/design-system/components/DSMobilePage";
import DSMobileHeader from "@/src/design-system/components/DSMobileHeader";
import PhotosSection from "@/src/modules/service_calls/components/PhotosSection";
import SignatureSection from "@/src/modules/service_calls/components/SignatureSection";

export default function TechnicianCallDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const {
        serviceCall,
        setServiceCall,
        loading,
        error,
        notes,
        setNotes,
        photos,
        uploadStatus,
        uploadError,
        savingSignature,
        handleSaveNotes,
        handleUploadPhoto,
        handleDeletePhoto,
        handleSaveSignature,
        savingNotes,
        deletingPhotoId,
    } = useServiceCallDetails(id);

    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    if (loading) {
        return <TechnicianCallDetailsSkeleton />;
    }

    if (error || !serviceCall) {
        return (
            <DSMobilePage
                header={<DSMobileHeader title="Erreur" onBack={() => router.push("/technician")} />}
            >
                <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
                    <div className="rounded-full bg-red-500/10 p-3 text-red-600">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-base font-bold text-[var(--foreground)]">Fiche Introuvable</h2>
                    <p className="text-sm text-[var(--foreground)]/60 max-w-xs">{error || "Intervention introuvable."}</p>
                    <a href="/technician" className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                        Retour aux missions
                    </a>
                </div>
            </DSMobilePage>
        );
    }

    // GPS launcher action
    const handleGPSLaunch = () => {
        if (!serviceCall.address) return;
        const encodedAddr = encodeURIComponent(serviceCall.address);
        const appleUrl = `maps://maps.apple.com/?daddr=${encodedAddr}`;
        const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}`;

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        window.open(isIOS ? appleUrl : googleUrl, "_blank");
    };

    // Quick Status Update
    const handleStatusTransition = async (nextStatus: string) => {
        if (updatingStatus) return;
        setUpdatingStatus(true);
        setStatusError(null);
        try {
            // Import api client dynamically to update status
            const api = await import("@/src/modules/service_calls/services");
            const { completed_at, closed_at } = await api.updateServiceCallStatus(id, nextStatus);
            setServiceCall((prev) => prev ? { ...prev, status: nextStatus, completed_at, closed_at } : null);
        } catch (err) {
            const errorInstance = err as Error;
            setStatusError(errorInstance?.message || "Échec de la transition de statut.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const currentStatus = serviceCall.status || "new";

    // Render logic helper for sticky progressive bottom status actions
    const renderStatusActionButton = () => {
        if (updatingStatus) {
            return (
                <button disabled className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-slate-400 text-white font-semibold cursor-not-allowed">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Mise à jour en cours...
                </button>
            );
        }

        switch (currentStatus) {
            case "new":
            case "assigned":
                return (
                    <button
                        onClick={() => handleStatusTransition("on_the_way")}
                        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold active:scale-98 transition-all shadow-sm cursor-pointer"
                    >
                        🚚 Démarrer la route (En Route)
                    </button>
                );
            case "on_the_way":
                return (
                    <button
                        onClick={() => handleStatusTransition("on_site")}
                        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold active:scale-98 transition-all shadow-sm cursor-pointer"
                    >
                        🔧 Arrivé sur place (Commencer)
                    </button>
                );
            case "on_site":
            case "waiting_parts":
                return (
                    <button
                        onClick={() => handleStatusTransition("completed")}
                        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold active:scale-98 transition-all shadow-sm cursor-pointer"
                    >
                        ✅ Finaliser l&apos;intervention (Terminé)
                    </button>
                );
            case "completed":
            case "closed":
            default:
                return (
                    <div className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                        🎉 Intervention Clôturée
                    </div>
                );
        }
    };

    return (
        <DSMobilePage
            header={<DSMobileHeader title={serviceCall.reference_number || "Intervention"} onBack={() => router.push("/technician")} />}
            bottomNav={
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--card-bg)] border-t border-[var(--card-border)] p-4 pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
                    {renderStatusActionButton()}
                </div>
            }
        >
            <div className="space-y-4">
                {statusError && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-600 dark:text-red-400" role="alert">
                        {statusError}
                    </div>
                )}

                {/* 1. Client + Address Info */}
                <DSCard variant="default" padding="md" className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                            <span className="text-xs font-bold text-[var(--foreground)]/40 uppercase tracking-wider">Client</span>
                            <h2 className="text-lg font-bold text-[var(--foreground)] leading-tight">{serviceCall.client_name}</h2>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                            <DSBadge category="status" variant={currentStatus} />
                            <DSBadge category="priority" variant={serviceCall.priority || "medium"} />
                        </div>
                    </div>

                    <div className="border-t border-[var(--card-border)] pt-3.5 space-y-3">
                        <div className="flex items-start gap-2 text-sm text-[var(--foreground)]/80 leading-relaxed break-words">
                            <span className="shrink-0">📍</span>
                            <span>{serviceCall.address}</span>
                        </div>

                        {/* 2. GPS Launcher Trigger */}
                        {serviceCall.address ? (
                            <button
                                onClick={handleGPSLaunch}
                                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-[var(--card-border)] text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--foreground)] active:scale-98 transition-all cursor-pointer"
                            >
                                <svg className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Naviguer avec le GPS
                            </button>
                        ) : null}
                    </div>
                </DSCard>

                {/* 3. Issue / Problem Description */}
                <DSCard variant="outlined" padding="md" className="space-y-2">
                    <span className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-wider block">Description de la Panne</span>
                    <p className="text-base text-[var(--foreground)]/90 leading-relaxed break-words font-sans">
                        {serviceCall.issue_description || "Aucune description de panne consignée."}
                    </p>
                </DSCard>

                {/* 4. Machine Info */}
                <DSCard variant="outlined" padding="md" className="space-y-2.5">
                    <span className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-wider block">Détails de l&apos;Équipement</span>
                    <div className="grid grid-cols-2 gap-3 text-sm pt-0.5">
                        <div className="space-y-0.5">
                            <span className="text-xs text-[var(--foreground)]/45 uppercase tracking-wider block">Code Série</span>
                            <span className="font-semibold text-[var(--foreground)] break-all">{serviceCall.machine_serial || "—"}</span>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-xs text-[var(--foreground)]/45 uppercase tracking-wider block">Technicien</span>
                            <span className="font-semibold text-[var(--foreground)]">{serviceCall.technician_name || "Non assigné"}</span>
                        </div>
                    </div>
                </DSCard>

                {/* 5. Notes update form */}
                <DSCard variant="outlined" padding="md" className="space-y-3">
                    <span className="text-[11px] font-bold text-[var(--foreground)]/40 uppercase tracking-wider block">Rapport / Notes de visite</span>
                    <textarea
                        className="w-full min-h-[96px] rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-base text-[var(--foreground)] placeholder-[var(--foreground)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                        placeholder="Rapportez les détails techniques de la visite..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-98 transition-all disabled:opacity-50 cursor-pointer shadow-2xs text-sm"
                    >
                        {savingNotes ? "Enregistrement..." : "Mettre à jour les notes"}
                    </button>
                </DSCard>

                {/* 6. Photos & Attachments Section */}
                <PhotosSection
                    photos={photos}
                    uploadStatus={uploadStatus}
                    uploadError={uploadError}
                    handleUploadPhoto={handleUploadPhoto}
                    handleDeletePhoto={handleDeletePhoto}
                    setActivePhotoModal={() => {}} // Disabled full preview modal to keep code compact, or add it if needed
                    deletingPhotoId={deletingPhotoId}
                />

                {/* 7. Signature Client Section */}
                <SignatureSection
                    serviceCall={serviceCall}
                    savingSignature={savingSignature}
                    handleSaveSignature={handleSaveSignature}
                />
            </div>
        </DSMobilePage>
    );
}

function TechnicianCallDetailsSkeleton() {
    return (
        <DSMobilePage header={<DSMobileHeader title="Chargement..." />}>
            <div className="space-y-4 animate-pulse">
                <DSCard variant="default" padding="md" className="h-48 bg-[var(--foreground)]/5 border-[var(--card-border)]" />
                <DSCard variant="outlined" padding="md" className="h-28 bg-[var(--foreground)]/5 border-[var(--card-border)]" />
                <DSCard variant="outlined" padding="md" className="h-24 bg-[var(--foreground)]/5 border-[var(--card-border)]" />
                <DSCard variant="outlined" padding="md" className="h-40 bg-[var(--foreground)]/5 border-[var(--card-border)]" />
            </div>
        </DSMobilePage>
    );
}
