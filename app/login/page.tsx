"use client";

<div style={{ background: "red", color: "white", padding: 12 }}>
    VERSION TEST LOGIN 2026-05-25
</div>

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase-client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        let success = false;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log("[LOGIN] error message:", error?.message || "none");
            console.log("[LOGIN] session exists:", !!data?.session);
            console.log("[LOGIN] user id exists:", !!data?.user?.id);

            if (error) {
                setMessage(error.message || "Une erreur est survenue lors de la connexion.");
            } else if (!data?.user) {
                setMessage("Utilisateur non trouvé.");
            } else {
                success = true;
                window.location.href = "/dashboard";
            }
        } catch (err: any) {
            console.error("[LOGIN] unexpected error:", err);
            setMessage(err.message || "Une erreur inattendue est survenue.");
        } finally {
            if (!success) {
                setLoading(false);
            }
        }
    }

    async function handleSignup() {
        setLoading(true);
        setMessage("");

        const fullName = email.split("@")[0];

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) {
            console.log("[SIGNUP] signup error:", error.message);
            setMessage(error.message);
            setLoading(false);
            return;
        }

        console.log("[SIGNUP] signup success, calling notify-signup");

        try {
            const res = await fetch("/api/notify-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    fullName,
                    role: "technician",
                }),
            });
            console.log("[SIGNUP] notify-signup response status:", res.status);
            const resData = await res.json();
            console.log("[SIGNUP] notify-signup response data:", resData);
        } catch (err) {
            console.error("[SIGNUP] notify-signup error:", err);
        }

        setMessage("Votre compte est en attente d’approbation par un administrateur.");
        setLoading(false);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-slate-950 to-black px-4 text-white">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8 animate-fade-in">
                <div className="mb-8 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 font-bold text-white text-xl shadow-lg">W</span>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent sm:text-3xl">
                        Connexion Welo
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Accédez à votre espace de gestion d'interventions
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Adresse Email</label>
                        <input
                            type="email"
                            placeholder="nom@exemple.com"
                            className="w-full min-h-12 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
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
                            className="w-full min-h-12 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full min-h-12 rounded-xl bg-cyan-500 py-3 font-semibold text-slate-950 hover:bg-cyan-400 active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Chargement..." : "Se connecter"}
                    </button>
                </form>

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="mt-3 w-full min-h-12 rounded-xl border border-slate-800 bg-transparent py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800/40 hover:text-white active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                    Créer un compte technicien
                </button>

                {message && (
                    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-center text-sm font-medium text-slate-300 leading-relaxed">
                        {message}
                    </div>
                )}
            </div>
        </main>
    );
}
