"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase-client";

export default function RejectedPage() {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            window.location.href = "/login";
        } catch (err) {
            console.error("Signout error:", err);
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8 text-center animate-fade-in">
                <div className="mb-6 flex justify-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-400 to-red-250 bg-clip-text text-transparent sm:text-3xl">
                    Accès Refusé
                </h1>
                <p className="mt-4 text-base text-slate-350 leading-relaxed">
                    Votre demande d’accès a été refusée. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter un responsable ou l'administrateur système.
                </p>

                <div className="mt-8 space-y-4">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleLogout}
                        className="w-full min-h-12 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700/50 py-3 font-semibold active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Déconnexion..." : "Retour à la connexion"}
                    </button>
                </div>

                <p className="mt-6 text-xs text-slate-500">
                    SME Field Operations • Plateforme Welo
                </p>
            </div>
        </main>
    );
}
