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

    console.log(`[VERCEL MIDDLEWARE LOG] Pathname: ${pathname}`);
    console.log(`[VERCEL MIDDLEWARE LOG] User ID: ${user ? user.id : "NULL"}`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_SET";
    const maskedUrl = supabaseUrl.replace(/https:\/\/([a-z0-9]+)\.supabase\.co/i, (match, ref) => {
        return `https://${ref.substring(0, 4)}...${ref.substring(ref.length - 2)}.supabase.co`;
    });
    console.log(`[VERCEL MIDDLEWARE LOG] Supabase URL: ${maskedUrl}`);

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
            console.log(`[VERCEL MIDDLEWARE LOG] Redirecting to /login (Unauthenticated)`);
            return redirectWithCookies("/login");
        }
        return supabaseResponse;
    }

    // 2. Fetch minimal profile fields (approved, role)
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("approved, role")
        .eq("id", user.id)
        .single();

    console.log(`[VERCEL MIDDLEWARE LOG] Profile Error:`, profileError ? `${profileError.code} - ${profileError.message}` : "NONE");
    console.log(`[VERCEL MIDDLEWARE LOG] Profile Data:`, profile ? `approved=${profile.approved}, role=${profile.role}` : "NULL");

    const isApproved = !!profile?.approved;

    // 3. Authenticated but unapproved users redirect to /awaiting-approval
    if (!isApproved) {
        if (pathname.startsWith("/dashboard")) {
            console.log(`[MIDDLEWARE DEBUG] Redirecting to /awaiting-approval (Unapproved)`);
            return redirectWithCookies("/awaiting-approval");
        }
    }

    // 4. Approved users going to /awaiting-approval redirect to /dashboard
    if (isApproved) {
        if (pathname === "/awaiting-approval") {
            console.log(`[MIDDLEWARE DEBUG] Redirecting to /dashboard (Approved)`);
            return redirectWithCookies("/dashboard");
        }
    }

    console.log(`[MIDDLEWARE DEBUG] Request allowed to pass: ${pathname}`);
    return supabaseResponse;
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*", "/awaiting-approval"],
};
