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

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold">Dashboard Welo</h1>
            <p className="mt-2 text-slate-600">
                Bienvenue {email ?? "chargement..."}
            </p>
        </main>
    );
}