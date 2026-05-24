"use client";

import { useEffect, useState } from "react";

const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/service-calls", label: "Appels de service" },
    { href: "/dashboard/clients", label: "Clients" },
    { href: "/dashboard/inventory", label: "Inventaire" },
    { href: "/dashboard/technicians", label: "Techniciens" },
];

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [menuOpen]);

    function closeMenu() {
        setMenuOpen(false);
    }

    const navLinkClass =
        "block rounded-lg px-4 py-3 text-base font-medium text-slate-100 hover:bg-slate-800 active:bg-slate-700";

    return (
        <div className="flex min-h-screen bg-slate-100">
            {menuOpen && (
                <button
                    type="button"
                    aria-label="Fermer le menu"
                    className="fixed inset-0 z-40 bg-slate-950/60 md:hidden"
                    onClick={closeMenu}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,18rem)] flex-col bg-slate-950 p-6 text-white shadow-xl transition-transform duration-200 ease-out md:static md:z-auto md:w-64 md:shrink-0 md:translate-x-0 md:shadow-none ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-cyan-400">Welo</h2>
                    <button
                        type="button"
                        aria-label="Fermer le menu"
                        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
                        onClick={closeMenu}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <nav className="mt-8 flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={navLinkClass}
                            onClick={closeMenu}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
                    <button
                        type="button"
                        aria-label="Ouvrir le menu"
                        aria-expanded={menuOpen}
                        className="rounded-lg p-2 text-white hover:bg-slate-800 active:bg-slate-700"
                        onClick={() => setMenuOpen(true)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <span className="text-lg font-bold text-cyan-400">Welo</span>
                </header>

                <main className="min-w-0 flex-1 px-4 py-5 md:px-8 md:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
