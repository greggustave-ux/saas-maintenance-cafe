"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase-client";

export default function AwaitingApprovalPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
                        <svg className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent sm:text-3xl">
                    Compte en attente
                </h1>
                <p className="mt-4 text-base text-slate-350 leading-relaxed">
                    Votre compte a été enregistré. Un administrateur doit confirmer votre profil avant que vous ne puissiez accéder aux interventions et données de la plateforme.
                </p>

                <div className="mt-8 space-y-4">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="w-full min-h-12 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700/50 py-3 font-semibold active:scale-98 transition-all shadow-md cursor-pointer"
                    >
                        Rafraîchir la page
                    </button>
                    
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleLogout}
                        className="w-full min-h-12 rounded-xl bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/25 py-3 font-semibold active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Déconnexion..." : "Se déconnecter"}
                    </button>
                </div>

                <p className="mt-6 text-xs text-slate-500">
                    SME Field Operations • Plateforme Welo
                </p>
            </div>
        </main>
    );
}
