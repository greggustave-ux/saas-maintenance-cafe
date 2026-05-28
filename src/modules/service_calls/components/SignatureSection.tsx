"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const SignatureCanvas = dynamic(() => import("react-signature-canvas"), {
    ssr: false,
}) as any;

const btnPrimaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-3 text-center text-base font-semibold hover:bg-slate-800 dark:hover:bg-white active:scale-98 transition-all md:w-auto cursor-pointer shadow-xs";

const btnSecondaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-3 text-center text-base font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 transition-all md:w-auto cursor-pointer";

const sectionCardClass =
    "w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6 space-y-4";

interface SignatureSectionProps {
    serviceCall: {
        id: number;
        signature_url: string | null;
    };
    savingSignature: boolean;
    handleSaveSignature: (canvasInstance: any) => Promise<void>;
}

export default function SignatureSection({
    serviceCall,
    savingSignature,
    handleSaveSignature,
}: SignatureSectionProps) {
    const signatureRef = useRef<any>(null);

    // Handle Responsive Signature Pad resize with device pixel ratio
    useEffect(() => {
        if (!serviceCall) return;

        function resizeCanvas() {
            const canvas = signatureRef.current?.getCanvas();
            if (canvas) {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                const width = canvas.offsetWidth;
                const height = canvas.offsetHeight;
                
                if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
                    const data = signatureRef.current?.toDataURL();
                    canvas.width = width * ratio;
                    canvas.height = height * ratio;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.scale(ratio, ratio);
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, width, height);
                    }
                    signatureRef.current?.clear();
                    
                    if (data && !signatureRef.current?.isEmpty()) {
                        const img = new Image();
                        img.onload = () => {
                            const ctx2 = canvas.getContext("2d");
                            if (ctx2) {
                                ctx2.fillStyle = "white";
                                ctx2.fillRect(0, 0, width, height);
                                ctx2.drawImage(img, 0, 0, width, height);
                            }
                        };
                        img.src = data;
                    }
                }
            }
        }

        // Delay slightly for render cycles
        const timer = setTimeout(() => {
            resizeCanvas();
            signatureRef.current?.clear();
        }, 300);
        window.addEventListener("resize", resizeCanvas);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [serviceCall?.id]);

    function clearSignature() {
        signatureRef.current?.clear();
    }

    return (
        <section className={sectionCardClass}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Signature client
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Veuillez faire signer le client ci-dessous pour valider la fin de l'intervention :
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
                <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    backgroundColor="white"
                    canvasProps={{
                        className: "h-[220px] w-full touch-none bg-white",
                    }}
                />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => handleSaveSignature(signatureRef.current)}
                    disabled={savingSignature}
                    className={`${btnPrimaryClass} flex-1`}
                >
                    {savingSignature ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Enregistrement...
                        </>
                    ) : (
                        "Enregistrer la signature"
                    )}
                </button>

                <button
                    type="button"
                    onClick={clearSignature}
                    className={btnSecondaryClass}
                >
                    Effacer
                </button>
            </div>

            {serviceCall.signature_url && (
                <div className="mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Signature validée :
                    </p>
                    <div className="inline-block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white p-2">
                        <img
                            src={serviceCall.signature_url}
                            alt="Signature client"
                            crossOrigin="anonymous"
                            className="h-16 w-auto object-contain sm:h-20"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
