import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh token if expired and retrieve current user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Helper to construct a redirect response while preserving session cookies
    const redirectWithCookies = (targetPath: string) => {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = targetPath;
        const response = NextResponse.redirect(redirectUrl);
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value, {
                path: cookie.path,
                domain: cookie.domain,
                maxAge: cookie.maxAge,
                secure: cookie.secure,
                httpOnly: cookie.httpOnly,
                sameSite: cookie.sameSite,
            });
        });
        return response;
    };

    // 1. Unauthenticated users redirect to /login
    if (!user) {
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname === "/awaiting-approval") {
            return redirectWithCookies("/login");
        }
        return supabaseResponse;
    }

    // 2. Fetch minimal profile fields (approved, role, status)
    const { data: profile } = await supabase
        .from("profiles")
        .select("approved, role, status")
        .eq("id", user.id)
        .single();

    const status = profile?.status || "pending";
    const isApproved = !!profile?.approved;

    // 3. Handle status based redirections
    if (status === "blocked") {
        if (pathname !== "/blocked") {
            return redirectWithCookies("/blocked");
        }
        return supabaseResponse;
    }

    if (status === "rejected") {
        if (pathname !== "/rejected") {
            return redirectWithCookies("/rejected");
        }
        return supabaseResponse;
    }

    // If user is approved, they should not be on awaiting/blocked/rejected pages
    if (status === "approved" || isApproved) {
        if (pathname === "/awaiting-approval" || pathname === "/blocked" || pathname === "/rejected") {
            return redirectWithCookies("/dashboard");
        }
    } else {
        // If not approved and not blocked/rejected, they are pending
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname === "/blocked" || pathname === "/rejected") {
            return redirectWithCookies("/awaiting-approval");
        }
    }

    // 4. Restrict /admin routes to admins only
    const isAdmin = profile?.role === "admin";
    if (pathname.startsWith("/admin")) {
        if (!isAdmin) {
            return redirectWithCookies("/dashboard");
        }
    }

    // 5. Restrict /dashboard/operations routes to admin and dispatcher only
    if (pathname.startsWith("/dashboard/operations")) {
        const isAllowed = profile?.role === "admin" || profile?.role === "dispatcher";
        if (!isAllowed) {
            return redirectWithCookies("/dashboard");
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*", "/awaiting-approval", "/admin", "/admin/:path*", "/blocked", "/rejected"],
};
