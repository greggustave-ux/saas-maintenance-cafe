"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase-client";

export default function DashboardPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        async function checkUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setEmail(user.email ?? null);
        }

        checkUser();
    }, [router]);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    }

    return (
        <div className="w-full md:max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard Welo
            </h1>
            <p className="mt-2 break-words text-base text-slate-700">
                Bienvenue {email ?? "chargement..."}
            </p>
            <button
                type="button"
                onClick={handleLogout}
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-center text-base font-semibold text-white active:bg-slate-800 md:w-auto"
            >
                Se déconnecter
            </button>
        </div>
    );
}
