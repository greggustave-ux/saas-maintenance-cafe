import { NextResponse } from "next/server";

export async function POST(request: Request) {
    console.log("[SERVER] /api/notify-approval route called");
    try {
        const payload = await request.json();
        console.log("[SERVER] Received approval notification payload:", payload);
        const { email, fullName } = payload;

        if (!email) {
            console.error("[SERVER] Approval notification validation failed: missing email");
            return NextResponse.json({ error: "Email requis" }, { status: 400 });
        }

        const resendKey = process.env.RESEND_API_KEY;
        console.log("[SERVER] Env check - RESEND_API_KEY:", resendKey ? `PRÉSENT (longueur ${resendKey.length})` : "ABSENT");

        if (!resendKey) {
            console.warn("[APPROVAL NOTIFICATION] RESEND_API_KEY non configurée. Email de confirmation d'approbation simulé.");
            return NextResponse.json({ 
                success: true, 
                message: "Email d'approbation simulé dans la console (RESEND_API_KEY manquante)." 
            });
        }

        const origin = new URL(request.url).origin;
        const loginLink = `${origin}/login`;

        console.log(`[APPROVAL NOTIFICATION] Sending approval email to ${fullName} (${email})...`);

        // Send email via Resend REST API
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Welo Platform <onboarding@resend.dev>",
                to: email,
                subject: "Votre compte Welo a été approuvé !",
                html: `
                    <div style="font-family: sans-serif; padding: 24px; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #0891b2; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 0;">Compte Activé !</h2>
                        <p style="font-size: 15px; color: #475569;">Bonjour ${fullName || "l'utilisateur"},</p>
                        <p style="font-size: 15px; color: #475569;">Bonne nouvelle ! Votre compte d'accès à la plateforme de gestion d'appels de service Welo a été validé et approuvé par un administrateur.</p>
                        <p style="font-size: 15px; color: #475569;">Vous pouvez désormais vous connecter et commencer à gérer vos interventions sur le terrain.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${loginLink}" style="background-color: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(8, 145, 178, 0.15);">
                                Se connecter à Welo
                            </a>
                        </div>

                        <p style="font-size: 13px; color: #64748b;">Si le bouton ci-dessus ne fonctionne pas, vous pouvez copier le lien suivant dans votre navigateur : <br/> ${loginLink}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0 15px 0;" />
                        <p style="font-size: 11px; text-align: center; color: #94a3b8; margin: 0;">Plateforme Welo • Notifications Automatiques</p>
                    </div>
                `
            })
        });

        console.log("[SERVER] Resend User approval notification response status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error("[SERVER] Resend API user approval email error body:", errText);
            throw new Error(`Erreur Resend: ${errText}`);
        }

        const resData = await response.json();
        return NextResponse.json({ success: true, resendData: resData });
    } catch (err: any) {
        console.error("[SERVER] User approval email handler crashed:", err);
        return NextResponse.json({ error: err.message || "Erreur interne" }, { status: 500 });
    }
}
