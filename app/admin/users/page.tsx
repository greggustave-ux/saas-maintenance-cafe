"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase-client";

interface Profile {
    id: string;
    full_name: string | null;
    role: string;
    approved: boolean;
    approved_at: string | null;
    approved_by: string | null;
    created_at: string | null;
    email: string | null;
}

const ROLE_LABELS: Record<string, string> = {
    admin: "Administrateur",
    technician: "Technicien",
    dispatcher: "Répartiteur",
    viewer: "Lecteur",
};

export default function AdminUsersPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved">("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");

    // Modal state
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => Promise<void>;
    }>({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: async () => {},
    });

    async function loadData() {
        setLoading(true);
        setError(null);
        try {
            // Get logged in user id
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (user) {
                setCurrentUserId(user.id);
            }

            // Fetch all profiles via RPC
            const { data, error: rpcError } = await supabase.rpc("get_all_profiles_for_admin");
            if (rpcError) {
                console.error("RPC Error:", rpcError);
                throw new Error(
                    "Impossible de charger la liste. Assurez-vous d'avoir exécuté le script SQL dans 'supabase_admin_rpc.sql' dans votre console Supabase."
                );
            }

            setProfiles(data || []);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors du chargement des profils.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // Perform the database update
    async function updateProfile(userId: string, newRole: string, newApproved: boolean) {
        setSubmittingId(userId);
        setError(null);
        setSuccess(null);
        try {
            const { error: updateError } = await supabase.rpc("admin_update_profile", {
                target_user_id: userId,
                new_role: newRole,
                new_approved: newApproved,
            });

            if (updateError) {
                throw updateError;
            }

            setSuccess("Profil mis à jour avec succès.");
            await loadData();
        } catch (err: any) {
            console.error("Update Error:", err);
            setError(err.message || "Une erreur est survenue lors de la mise à jour.");
        } finally {
            setSubmittingId(null);
            setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
    }

    // Handlers to open confirmation modal
    function handleToggleApproval(profile: Profile) {
        const nextApproved = !profile.approved;
        const actionText = nextApproved ? "approuver" : "bloquer/désapprouver";
        const title = nextApproved ? "Approuver l'utilisateur ?" : "Bloquer l'utilisateur ?";
        const description = `Êtes-vous sûr de vouloir ${actionText} l'utilisateur "${profile.full_name || profile.email}" ?`;

        if (profile.id === currentUserId && !nextApproved) {
            setError("Action interdite : Vous ne pouvez pas désapprouver votre propre compte.");
            return;
        }

        setModalConfig({
            isOpen: true,
            title,
            description,
            onConfirm: () => updateProfile(profile.id, profile.role, nextApproved),
        });
    }

    function handleRoleChange(profile: Profile, newRole: string) {
        const title = "Changer le rôle ?";
        const description = `Êtes-vous sûr de vouloir changer le rôle de "${profile.full_name || profile.email}" de "${ROLE_LABELS[profile.role]}" à "${ROLE_LABELS[newRole]}" ?`;

        if (profile.id === currentUserId && newRole !== "admin") {
            setError("Action interdite : Vous ne pouvez pas vous retirer votre propre rôle administrateur.");
            return;
        }

        setModalConfig({
            isOpen: true,
            title,
            description,
            onConfirm: () => updateProfile(profile.id, newRole, profile.approved),
        });
    }

    // Filters logic
    const filteredProfiles = profiles.filter((p) => {
        const matchesSearch =
            (p.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.email || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "approved" && p.approved) ||
            (statusFilter === "pending" && !p.approved);

        const matchesRole = roleFilter === "all" || p.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    const pendingCount = profiles.filter((p) => !p.approved).length;

    return (
        <div className="w-full space-y-6">
            {/* Header Area */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Gestion des Utilisateurs
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                        Approuvez les nouvelles inscriptions et configurez les rôles d'accès de l'application.
                    </p>
                </div>
                {pendingCount > 0 && (
                    <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        {pendingCount} inscription{pendingCount > 1 ? "s" : ""} en attente
                    </span>
                )}
            </div>

            {/* Notification messages */}
            {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400 flex items-start gap-3">
                    <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                        <p className="font-semibold">Erreur</p>
                        <p className="mt-0.5">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 dark:hover:text-red-300">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {success && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600 dark:text-emerald-400 flex items-start gap-3">
                    <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                        <p className="font-semibold">Succès</p>
                        <p className="mt-0.5">{success}</p>
                    </div>
                    <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300">
                        <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="grid gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 p-4 backdrop-blur-md sm:grid-cols-12">
                <div className="relative sm:col-span-6">
                    <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-11 pr-4 text-sm text-slate-900 dark:text-white"
                    />
                </div>
                <div className="sm:col-span-3">
                    <select
                        aria-label="Filtrer par statut"
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-white"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente d'approbation</option>
                        <option value="approved">Approuvés</option>
                    </select>
                </div>
                <div className="sm:col-span-3">
                    <select
                        aria-label="Filtrer par rôle"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 text-sm text-slate-900 dark:text-white"
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="admin">Administrateurs</option>
                        <option value="technician">Techniciens</option>
                        <option value="dispatcher">Répartiteurs</option>
                        <option value="viewer">Lecteurs</option>
                    </select>
                </div>
            </div>

            {/* Profiles List */}
            {loading ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-3 border-cyan-500 border-t-transparent"></div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Chargement des utilisateurs...</p>
                </div>
            ) : filteredProfiles.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 p-8 text-center">
                    <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A2.25 2.25 0 0112.75 21.5h-1.5a2.25 2.25 0 01-2.25-2.263V19.13m-2.625.372a9.398 9.398 0 01-2.625-.372C1.343 18.252 1 16.55 1 14.75c0-1.03.188-2.022.532-2.94a4.125 4.125 0 017.533 2.493M18.75 8.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12.75 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    <p className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-200">Aucun utilisateur trouvé</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Essayez d'élargir vos filtres ou termes de recherche.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xs">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200/80 dark:border-slate-800/80">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Utilisateur</th>
                                    <th scope="col" className="px-6 py-4">Statut</th>
                                    <th scope="col" className="px-6 py-4">Rôle</th>
                                    <th scope="col" className="px-6 py-4">Date d'inscription</th>
                                    <th scope="col" className="px-6 py-4">Détails d'approbation</th>
                                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
                                {filteredProfiles.map((profile) => {
                                    const isSelf = profile.id === currentUserId;
                                    const isUpdating = submittingId === profile.id;

                                    return (
                                        <tr key={profile.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {profile.full_name || "Nom non renseigné"}
                                                        {isSelf && (
                                                            <span className="ml-2 inline-flex items-center rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                                                Vous
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">{profile.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {profile.approved ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approuvé
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/10">
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        En attente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    aria-label={`Rôle de ${profile.email}`}
                                                    value={profile.role}
                                                    disabled={isSelf || isUpdating}
                                                    onChange={(e) => handleRoleChange(profile, e.target.value)}
                                                    className="h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2.5 text-xs text-slate-900 dark:text-white font-medium disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                                                >
                                                    <option value="technician">Technicien</option>
                                                    <option value="dispatcher">Répartiteur</option>
                                                    <option value="viewer">Lecteur</option>
                                                    <option value="admin">Administrateur</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {profile.created_at
                                                    ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
                                                          day: "numeric",
                                                          month: "short",
                                                          year: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {profile.approved_at ? (
                                                    <div className="flex flex-col">
                                                        <span>
                                                            Approuvé le{" "}
                                                            {new Date(profile.approved_at).toLocaleDateString("fr-FR", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="italic text-slate-400">Non approuvé</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {profile.approved ? (
                                                    <button
                                                        type="button"
                                                        disabled={isSelf || isUpdating}
                                                        onClick={() => handleToggleApproval(profile)}
                                                        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-red-500/20 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/10 active:bg-red-500/20 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                                                    >
                                                        {isUpdating ? "Mise à jour..." : "Bloquer"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={isUpdating}
                                                        onClick={() => handleToggleApproval(profile)}
                                                        className="inline-flex min-h-9 items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 active:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                                                    >
                                                        {isUpdating ? "Mise à jour..." : "Approuver"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Grid */}
                    <div className="block md:hidden divide-y divide-slate-200/80 dark:divide-slate-800/80">
                        {filteredProfiles.map((profile) => {
                            const isSelf = profile.id === currentUserId;
                            const isUpdating = submittingId === profile.id;

                            return (
                                <div key={profile.id} className="p-4 space-y-3.5 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {profile.full_name || "Nom non renseigné"}
                                                {isSelf && (
                                                    <span className="ml-2 inline-flex items-center rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                                        Vous
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{profile.email}</span>
                                        </div>
                                        <div>
                                            {profile.approved ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                                                    Approuvé
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/10">
                                                    En attente
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Rôle</p>
                                            <select
                                                aria-label={`Rôle de ${profile.email}`}
                                                value={profile.role}
                                                disabled={isSelf || isUpdating}
                                                onChange={(e) => handleRoleChange(profile, e.target.value)}
                                                className="mt-1 h-9 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 text-xs text-slate-900 dark:text-white font-medium disabled:opacity-60 cursor-pointer"
                                            >
                                                <option value="technician">Technicien</option>
                                                <option value="dispatcher">Répartiteur</option>
                                                <option value="viewer">Lecteur</option>
                                                <option value="admin">Administrateur</option>
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Inscription</p>
                                            <p className="mt-2.5 font-medium">
                                                {profile.created_at
                                                    ? new Date(profile.created_at).toLocaleDateString("fr-FR", {
                                                          day: "numeric",
                                                          month: "short",
                                                          year: "numeric",
                                                      })
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {profile.approved_at && (
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                                            Approuvé le{" "}
                                            {new Date(profile.approved_at).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-1 border-t border-slate-100 dark:border-slate-800/50">
                                        {profile.approved ? (
                                            <button
                                                type="button"
                                                disabled={isSelf || isUpdating}
                                                onClick={() => handleToggleApproval(profile)}
                                                className="w-full inline-flex min-h-9 items-center justify-center rounded-lg border border-red-500/20 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/10 active:bg-red-500/20 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                                            >
                                                {isUpdating ? "Mise à jour..." : "Bloquer le compte"}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={isUpdating}
                                                onClick={() => handleToggleApproval(profile)}
                                                className="w-full inline-flex min-h-9 items-center justify-center rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 active:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                                            >
                                                {isUpdating ? "Mise à jour..." : "Approuver le compte"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Custom Premium Modal Dialog */}
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div 
                        role="dialog"
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                        className="w-full max-w-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-2xl scale-100 transition-all"
                    >
                        <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                            {modalConfig.title}
                        </h3>
                        <p id="modal-description" className="mt-2.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {modalConfig.description}
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={modalConfig.onConfirm}
                                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-all cursor-pointer shadow-md shadow-cyan-600/10"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
