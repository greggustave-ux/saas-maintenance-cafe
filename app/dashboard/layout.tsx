export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="w-64 bg-slate-950 text-white p-6">
                <h2 className="text-2xl font-bold text-cyan-400">
                    Welo
                </h2>

                <nav className="mt-10 space-y-4">
                    <a
                        href="/dashboard"
                        className="block rounded-lg px-4 py-2 hover:bg-slate-800"
                    >
                        Dashboard
                    </a>

                    <a
                        href="/dashboard/service-calls"
                        className="block rounded-lg px-4 py-2 hover:bg-slate-800"
                    >
                        Appels de service
                    </a>

                    <a
                        href="/dashboard/clients"
                        className="block rounded-lg px-4 py-2 hover:bg-slate-800"
                    >
                        Clients
                    </a>

                    <a
                        href="/dashboard/inventory"
                        className="block rounded-lg px-4 py-2 hover:bg-slate-800"
                    >
                        Inventaire
                    </a>

                    <a
                        href="/dashboard/technicians"
                        className="block rounded-lg px-4 py-2 hover:bg-slate-800"
                    >
                        Techniciens
                    </a>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}