"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { supabase } from "@/src/lib/supabase-client";

const navLinks = [
    { 
        href: "/dashboard", 
        label: "Dashboard",
        icon: (
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    { 
        href: "/dashboard/service-calls", 
        label: "Appels de service",
        icon: (
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        )
    },
    { 
        href: "/dashboard/clients", 
        label: "Clients",
        icon: (
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )
    },
    { 
        href: "/dashboard/inventory", 
        label: "Inventaire",
        icon: (
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )
    },
    { 
        href: "/dashboard/technicians", 
        label: "Techniciens",
        icon: (
            <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
        )
    },
];

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        async function checkAdmin() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("role")
                        .eq("id", user.id)
                        .single();
                    if (profile?.role === "admin") {
                        setIsAdmin(true);
                    }
                    setUserRole(profile?.role || null);
                }
            } catch (error) {
                console.error("Error loading user profile:", error);
            }
        }
        checkAdmin();
    }, []);

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

    const showOperations = userRole === "admin" || userRole === "dispatcher";

    const baseLinks = showOperations 
        ? [
              navLinks[0], // Dashboard link
              {
                  href: "/dashboard/operations",
                  label: "Opérations",
                  icon: (
                      <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                  ),
              },
              ...navLinks.slice(1)
          ]
        : navLinks;

    const links = isAdmin
        ? [
              ...baseLinks,
              {
                  href: "/admin/users",
                  label: "Utilisateurs",
                  icon: (
                      <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                  ),
              },
          ]
        : baseLinks;


    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {menuOpen && (
                <button
                    type="button"
                    aria-label="Fermer le menu"
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
                    onClick={closeMenu}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-slate-900 p-6 text-white shadow-2xl transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) md:static md:z-auto md:w-64 md:shrink-0 md:translate-x-0 md:shadow-none ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-12 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="h-6.5 w-6.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">W</span>
                        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">Welo</h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Fermer le menu"
                        className="flex min-h-12 min-w-12 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white active:bg-slate-700 md:hidden"
                        onClick={closeMenu}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="mt-8 flex flex-col gap-1.5">
                    {links.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`flex min-h-12 items-center gap-3.5 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-cyan-500/15 text-cyan-400 font-semibold shadow-xs border border-cyan-500/10"
                                        : "text-slate-300 hover:bg-slate-800/60 active:bg-slate-800"
                                }`}
                                onClick={closeMenu}
                            >
                                <span className={isActive ? "text-cyan-400" : "text-slate-400"}>{link.icon}</span>
                                {link.label}
                            </a>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 py-3 md:hidden">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Ouvrir le menu"
                            aria-expanded={menuOpen}
                            className="flex min-h-12 min-w-12 items-center justify-center rounded-lg text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
                            onClick={() => setMenuOpen(true)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-1.5">
                            <span className="h-5.5 w-5.5 rounded bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">W</span>
                            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-cyan-400">Welo</span>
                        </div>
                    </div>
                </header>

                <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

