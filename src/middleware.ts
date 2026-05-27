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
        if (pathname.startsWith("/dashboard") || pathname === "/awaiting-approval") {
            return redirectWithCookies("/login");
        }
        return supabaseResponse;
    }

    // 2. Fetch minimal profile fields (approved, role)
    const { data: profile } = await supabase
        .from("profiles")
        .select("approved, role")
        .eq("id", user.id)
        .single();

    const isApproved = !!profile?.approved;

    // 3. Authenticated but unapproved users redirect to /awaiting-approval
    if (!isApproved) {
        if (pathname.startsWith("/dashboard")) {
            return redirectWithCookies("/awaiting-approval");
        }
    }

    // 4. Approved users going to /awaiting-approval redirect to /dashboard
    if (isApproved) {
        if (pathname === "/awaiting-approval") {
            return redirectWithCookies("/dashboard");
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*", "/awaiting-approval"],
};
