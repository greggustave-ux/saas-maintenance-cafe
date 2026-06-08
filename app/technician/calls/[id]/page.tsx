"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServiceCallDetails } from "@/src/modules/service_calls/hooks";
import { DSBadge } from "@/src/design-system/components/DSBadge";
import { DSCard } from "@/src/design-system/components/DSCard";
import DSMobilePage from "@/src/design-system/components/DSMobilePage";
import DSMobileHeader from "@/src/design-system/components/DSMobileHeader";

export default function TechnicianCallDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const {
        serviceCall,
        setServiceCall,
        loading,
        error,
        photos,
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

                {/* 1. Client Info Header */}
                <DSCard variant="default" padding="md" className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            {serviceCall.reference_number && (
                                <span className="block text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase leading-none">
                                    Intervention {serviceCall.reference_number}
                                </span>
                            )}
                            <h2 className="text-xl font-bold text-[var(--foreground)] leading-tight tracking-tight">
                                {serviceCall.client_name}
                            </h2>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                            <DSBadge category="status" variant={currentStatus} className="rounded-md" />
                            <DSBadge category="priority" variant={serviceCall.priority || "medium"} className="rounded-md font-extrabold" />
                        </div>
                    </div>
                </DSCard>

                {/* 2. Interactive Address & GPS Navigation Card */}
                {serviceCall.address ? (
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serviceCall.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left cursor-pointer active:scale-[0.99] transition-transform duration-150"
                    >
                        <DSCard 
                            variant="outlined" 
                            padding="md" 
                            className="relative hover:border-[var(--primary)]/60 dark:hover:border-[var(--primary)]/60 transition-colors duration-200 flex items-center justify-between gap-4"
                        >
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <span className="block text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase leading-none">
                                    📍 Adresse d&apos;intervention
                                </span>
                                <p className="text-sm font-semibold text-[var(--foreground)] leading-relaxed break-words">
                                    {serviceCall.address}
                                </p>
                            </div>
                            <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-[var(--primary)]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </DSCard>
                    </a>
                ) : (
                    <DSCard variant="outlined" padding="md" className="flex items-center gap-3 text-slate-400">
                        <span>📍</span>
                        <span className="text-sm font-medium">Adresse non renseignée</span>
                    </DSCard>
                )}

                {/* 3. Issue / Problem Description */}
                <DSCard variant="outlined" padding="md" className="space-y-2">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase block leading-none">
                        Description de la Panne
                    </span>
                    <p className="text-sm text-[var(--foreground)]/85 leading-relaxed break-words">
                        {serviceCall.issue_description || "Aucune description de panne consignée."}
                    </p>
                </DSCard>

                {/* 4. Machine Info */}
                <DSCard variant="outlined" padding="md" className="space-y-3">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase block leading-none">
                        Détails de l&apos;Équipement
                    </span>
                    <div className="grid grid-cols-2 gap-4 text-[13px] pt-1">
                        <div className="space-y-1">
                            <span className="text-[11px] text-[var(--foreground)]/45 uppercase tracking-wider block leading-none">Code Série</span>
                            <span className="font-mono font-semibold text-[var(--foreground)] break-all bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 px-2 py-1 rounded-md inline-block">
                                {serviceCall.machine_serial || "—"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] text-[var(--foreground)]/45 uppercase tracking-wider block leading-none">Technicien</span>
                            <span className="font-semibold text-[var(--foreground)] block pt-1">{serviceCall.technician_name || "Non assigné"}</span>
                        </div>
                    </div>
                </DSCard>

                {/* 5. Notes (Read-Only) */}
                <DSCard variant="outlined" padding="md" className="space-y-2.5">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase block leading-none">
                        Rapport / Notes de visite
                    </span>
                    <p className="text-sm text-[var(--foreground)]/80 leading-relaxed break-words whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/30 dark:border-slate-800/30 p-3 rounded-xl">
                        {serviceCall.technician_notes || "Aucune note technique n&apos;a été saisie pour le moment."}
                    </p>
                </DSCard>

                {/* 6. Photos (Read-Only) */}
                <DSCard variant="outlined" padding="md" className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase block leading-none">
                            Photos de l&apos;intervention
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[var(--foreground)]/50">{photos.length} photo(s)</span>
                    </div>
                    {photos.length === 0 ? (
                        <p className="text-sm text-[var(--foreground)]/50">Aucune photo enregistrée.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {photos.map((photo) => (
                                <div key={photo.id} className="relative aspect-4/3 overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900">
                                    <img
                                        src={photo.photo_url}
                                        alt="Intervention"
                                        crossOrigin="anonymous"
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </DSCard>

                {/* 7. Signature Client (Read-Only) */}
                <DSCard variant="outlined" padding="md" className="space-y-3">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--foreground)]/45 uppercase block leading-none">
                        Signature Client
                    </span>
                    {serviceCall.signature_url ? (
                        <div className="inline-block overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white p-2">
                            <img
                                src={serviceCall.signature_url}
                                alt="Signature client"
                                crossOrigin="anonymous"
                                className="h-16 w-auto object-contain sm:h-20"
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--foreground)]/50">L&apos;intervention n&apos;est pas encore signée.</p>
                    )}
                </DSCard>
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
