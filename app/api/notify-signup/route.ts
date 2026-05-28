import { NextResponse } from "next/server";

export async function POST(request: Request) {
    console.log("[SERVER] /api/notify-signup route called");
    try {
        const payload = await request.json();
        console.log("[SERVER] Received payload:", payload);
        const { email, fullName, role } = payload;

        // Basic payload validation
        if (!email) {
            console.error("[SERVER] Email validation failed: missing email");
            return NextResponse.json({ error: "Email requis" }, { status: 400 });
        }

        const dateStr = new Date().toLocaleString("fr-FR", {
            timeZone: "America/New_York",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
        const resendKey = process.env.RESEND_API_KEY;

        console.log("[SERVER] Env check - ADMIN_NOTIFICATION_EMAIL:", adminEmail ? `PRÉSENT (${adminEmail})` : "ABSENT (utilisera la valeur par défaut)");
        console.log("[SERVER] Env check - RESEND_API_KEY:", resendKey ? `PRÉSENT (longueur ${resendKey.length})` : "ABSENT");

        const targetAdminEmail = adminEmail || "greg.gustave@gmail.com";
        console.log("[SERVER] Target admin email resolved to:", targetAdminEmail);

        console.log(`[SIGNUP NOTIFICATION] User registered: ${fullName} (${email}) at ${dateStr}. Role: ${role}`);

        if (!resendKey) {
            console.warn("[SIGNUP NOTIFICATION] RESEND_API_KEY non configurée. Email de notification simulé.");
            return NextResponse.json({ 
                success: true, 
                message: "Email simulé dans la console (RESEND_API_KEY manquante)." 
            });
        }

        const origin = new URL(request.url).origin;
        const adminUsersLink = `${origin}/admin/users`;

        console.log("[SERVER] Calling Resend API...");
        // Send email via Resend REST API
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Welo Platform <onboarding@resend.dev>",
                to: targetAdminEmail,
                subject: "Nouveau compte Welo en attente d'approbation",
                html: `
                    <div style="font-family: sans-serif; padding: 24px; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #0891b2; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 0;">Nouveau compte utilisateur</h2>
                        <p style="font-size: 15px; color: #475569;">Un nouvel utilisateur vient de s'inscrire sur la plateforme Welo et attend l'approbation d'un administrateur :</p>
                        
                        <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; font-weight: bold; width: 140px; color: #64748b;">Nom d'utilisateur :</td>
                                    <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #0f172a;">${fullName || "Non spécifié"}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #64748b;">Adresse Email :</td>
                                    <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #64748b;">Date d'inscription :</td>
                                    <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">${dateStr}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #64748b;">Rôle demandé :</td>
                                    <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">
                                        <span style="background-color: #ecfeff; color: #0891b2; border: 1px solid #cffafe; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px;">
                                            ${role || "technician"}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>
 
                        <p style="font-size: 14px; color: #475569; margin-bottom: 24px;">Vous pouvez approuver ce compte ou lui affecter un rôle différent depuis la console administrative.</p>
                        
                        <div style="text-align: center;">
                            <a href="${adminUsersLink}" style="background-color: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(8, 145, 178, 0.15);">
                                Gérer les utilisateurs (/admin/users)
                            </a>
                        </div>
                        
                        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0 15px 0;" />
                        <p style="font-size: 11px; text-align: center; color: #94a3b8; margin: 0;">Plateforme Welo • Notifications Automatiques</p>
                    </div>
                `
            })
        });
 
        console.log("[SERVER] Resend API response status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error("[SERVER] Resend API error body:", errText);
            throw new Error(`Erreur Resend: ${errText}`);
        }
 
        const resData = await response.json();
        console.log("[SERVER] Resend API success body:", resData);

        return NextResponse.json({ success: true, resendData: resData });
    } catch (err: any) {
        console.error("[SERVER] Signup notification handler crashed:", err);
        return NextResponse.json({ error: err.message || "Erreur interne" }, { status: 500 });
    }
}
