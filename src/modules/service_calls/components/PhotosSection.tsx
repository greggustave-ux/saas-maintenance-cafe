"use client";

import { ServiceCallPhoto } from "../types";
import { UploadStatus } from "../hooks";

const btnDangerClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 active:scale-98 transition-all cursor-pointer";

const sectionCardClass =
    "w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6 space-y-4";

interface PhotosSectionProps {
    photos: ServiceCallPhoto[];
    uploadStatus: UploadStatus;
    uploadError: string | null;
    handleUploadPhoto: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDeletePhoto: (photoId: number, photoUrl: string) => Promise<void>;
    setActivePhotoModal: (url: string) => void;
    deletingPhotoId?: number | null;
}

function getUploadLabel(status: UploadStatus) {
    switch (status) {
        case "compressing":
            return "Compression en cours...";
        case "uploading":
            return "Envoi vers le stockage...";
        case "saving":
            return "Enregistrement en cours...";
        case "success":
            return "Photo téléversée !";
        default:
            return "Prendre / Ajouter une photo";
    }
}

export default function PhotosSection({
    photos,
    uploadStatus,
    uploadError,
    handleUploadPhoto,
    handleDeletePhoto,
    setActivePhotoModal,
    deletingPhotoId,
}: PhotosSectionProps) {
    const isUploading = uploadStatus !== "idle" && uploadStatus !== "success" && uploadStatus !== "error";

    return (
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
                        isUploading
                            ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700 opacity-60"
                            : "cursor-pointer bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-white active:scale-98"
                    }`}
                >
                    {isUploading ? (
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                    {getUploadLabel(uploadStatus)}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadPhoto}
                        disabled={isUploading}
                        className="sr-only"
                    />
                </label>

                {uploadError && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-3.5 text-sm text-red-600 dark:text-red-400" role="alert">
                        {uploadError}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 landscape:grid-cols-3 sm:grid-cols-3">
                    {/* Pulsing loading skeleton placeholder during image processing */}
                    {isUploading && (
                        <div className="group relative overflow-hidden rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-2 shadow-xs animate-pulse">
                            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center gap-1.5">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-350 border-t-cyan-500" />
                                <span className="text-[11px] font-semibold text-slate-400">
                                    {uploadStatus === "compressing" && "Compression..."}
                                    {uploadStatus === "uploading" && "Envoi..."}
                                    {uploadStatus === "saving" && "Sauvegarde..."}
                                </span>
                            </div>
                            <div className="mt-2 h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-850" />
                        </div>
                    )}

                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="group relative overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-850 p-2 shadow-xs"
                        >
                            <div 
                                className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-850 cursor-pointer"
                                onClick={() => setActivePhotoModal(photo.photo_url)}
                             >
                                <img
                                    src={photo.photo_url}
                                    alt="Aperçu de l'intervention"
                                    crossOrigin="anonymous"
                                    loading="lazy"
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
                                onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                                disabled={deletingPhotoId === photo.id}
                                className={`${btnDangerClass} mt-2 w-full min-h-10 text-sm py-2 disabled:opacity-50`}
                            >
                                {deletingPhotoId === photo.id ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500 inline-block" />
                                        Suppression...
                                    </>
                                ) : (
                                    "Supprimer la photo"
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
