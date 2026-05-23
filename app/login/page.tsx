"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/src/lib/supabase-client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    async function handleSignup() {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage("Compte créé.");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">
                <h1 className="mb-6 text-3xl font-bold">
                    Connexion Welo
                </h1>

                <form
                    onSubmit={handleLogin}
                    className="space-y-4"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-lg bg-slate-800 p-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="w-full rounded-lg bg-slate-800 p-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-cyan-400 p-3 font-bold text-slate-950"
                    >
                        Se connecter
                    </button>
                </form>

                <button
                    onClick={handleSignup}
                    className="mt-4 w-full rounded-lg border border-slate-700 p-3"
                >
                    Créer un compte
                </button>

                {message && (
                    <p className="mt-4 text-sm text-slate-300">
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
}