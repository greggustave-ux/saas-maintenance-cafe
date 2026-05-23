import { redirect } from "next/navigation";
import { supabase } from "@/src/lib/supabase-clients";

export default async function DashboardPage() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <h1 className="text-3xl font-bold">Dashboard Welo</h1>
            <p className="mt-2 text-slate-600">
                Bienvenue dans ton tableau de bord.
            </p>
        </main>
    );
}