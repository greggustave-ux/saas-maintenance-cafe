import { NextResponse } from "next/server";

export async function GET(request: Request) {
    console.log("[TEST EMAIL] route called");
    try {
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
        const resendKey = process.env.RESEND_API_KEY;

        console.log("[TEST EMAIL] Env check - ADMIN_NOTIFICATION_EMAIL:", adminEmail ? `PRÉSENT (${adminEmail})` : "ABSENT (utilisera la valeur par défaut)");
        console.log("[TEST EMAIL] Env check - RESEND_API_KEY:", resendKey ? `PRÉSENT (longueur ${resendKey.length})` : "ABSENT");

        const targetAdminEmail = adminEmail || "greg.gustave@gmail.com";
        console.log("[TEST EMAIL] Target admin email resolved to:", targetAdminEmail);

        if (!resendKey) {
            console.warn("[TEST EMAIL] RESEND_API_KEY non configurée.");
            return NextResponse.json({ 
                success: false, 
                error: "RESEND_API_KEY manquante" 
            }, { status: 400 });
        }

        console.log("[TEST EMAIL] Sending test request to Resend API...");
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Welo Platform Test <onboarding@resend.dev>",
                to: targetAdminEmail,
                subject: "Test Resend direct - Plateforme Welo",
                html: `
                    <div style="font-family: sans-serif; padding: 24px; color: #334155; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #0891b2;">Test Direct Resend</h2>
                        <p style="font-size: 15px;">Cet e-mail confirme que l'intégration directe de Resend fonctionne correctement depuis la route API <code>/api/test-email</code>.</p>
                        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
                        <p style="font-size: 11px; text-align: center; color: #94a3b8; margin: 0;">Plateforme Welo • Diagnostics</p>
                    </div>
                `
            })
        });

        console.log("[TEST EMAIL] Resend response status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error("[TEST EMAIL] Resend API error body:", errText);
            return NextResponse.json({ 
                success: false, 
                error: `Erreur Resend (${response.status}): ${errText}` 
            }, { status: 500 });
        }

        const resData = await response.json();
        console.log("[TEST EMAIL] Resend API success body:", resData);

        return NextResponse.json({ 
            success: true, 
            resendResponse: resData 
        });
    } catch (err: any) {
        console.error("[TEST EMAIL] Handler crashed:", err);
        return NextResponse.json({ 
            success: false, 
            error: err.message || "Erreur interne" 
        }, { status: 500 });
    }
}
