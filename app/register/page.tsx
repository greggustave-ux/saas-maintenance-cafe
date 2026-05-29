"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase-client";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [company, setCompany] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Validation simple
        if (password !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }

        try {
            // Création du compte utilisateur dans Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        company: company,
                        phone: phone,
                        role: "technician", // Rôle par défaut
                    }
                }
            });

            if (error) {
                setMessage(error.message || "Une erreur est survenue lors de la création du compte.");
                setLoading(false);
                return;
            }

            console.log("[REGISTER] Signup successful");
            console.log("[REGISTER] Calling notify-signup API...");

            // Notification de l'administrateur
            try {
                const res = await fetch("/api/notify-signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        fullName,
                        company,
                        phone,
                        role: "technician",
                    }),
                });
                console.log("[REGISTER] notify-signup API response status:", res.status);
            } catch (notifyErr) {
                console.error("[REGISTER] notify-signup API call failed:", notifyErr);
            }

            setSuccess(true);
        } catch (err: any) {
            console.error("[REGISTER] Unexpected registration error:", err);
            setMessage(err.message || "Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    }

    async function handleBackToLogin() {
        setLoading(true);
        try {
            // S'assurer de déconnecter l'utilisateur si Supabase l'a connecté automatiquement
            await supabase.auth.signOut();
            window.location.href = "/login";
        } catch (err) {
            console.error("[REGISTER] Error signing out:", err);
            window.location.href = "/login";
        }
    }

    if (success) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 text-white">
                <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8 text-center animate-fade-in">
                    <div className="mb-6 flex justify-center">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-emerald-250 bg-clip-text text-transparent sm:text-3xl">
                        Demande envoyée
                    </h1>
                    
                    <p className="mt-4 text-sm text-slate-300 leading-relaxed text-left sm:text-center">
                        Votre demande d’inscription a été envoyée. Un administrateur validera votre accès. Vous recevrez un courriel de confirmation lorsque votre compte sera activé.
                    </p>

                    <button
                        type="button"
                        onClick={handleBackToLogin}
                        className="mt-8 w-full min-h-12 rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 active:scale-98 transition-all shadow-md cursor-pointer"
                    >
                        Retour à la connexion
                    </button>

                    <p className="mt-6 text-xs text-slate-500">
                        SME Field Operations • Plateforme Welo
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 py-8 text-white">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8 animate-fade-in">
                <div className="mb-6 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 font-bold text-white text-xl shadow-lg">W</span>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent sm:text-3xl">
                        Créer un compte
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Inscrivez-vous pour rejoindre la plateforme Welo
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom complet</label>
                        <input
                            type="text"
                            placeholder="Jean Tremblay"
                            className="w-full min-h-11 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Entreprise</label>
                        <input
                            type="text"
                            placeholder="Clim-Tech Inc."
                            className="w-full min-h-11 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Téléphone</label>
                        <input
                            type="tel"
                            placeholder="514-555-0199"
                            className="w-full min-h-11 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Adresse Email</label>
                        <input
                            type="email"
                            placeholder="nom@entreprise.com"
                            className="w-full min-h-11 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full min-h-11 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full min-h-11 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full min-h-12 rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Création en cours..." : "Soumettre la demande"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => router.push("/login")}
                        className="text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        Déjà inscrit ? Se connecter
                    </button>
                </div>

                {message && (
                    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-center text-sm font-medium text-slate-300 leading-relaxed">
                        {message}
                    </div>
                )}
            </div>
        </main>
    );
}
