"use client";

import { ServiceCallPart } from "../types";

const inputClass =
    "w-full min-h-12 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

const btnPrimaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-3 text-center text-base font-semibold hover:bg-slate-800 dark:hover:bg-white active:scale-98 transition-all md:w-auto cursor-pointer shadow-xs";

const sectionCardClass =
    "w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-xs sm:p-6 space-y-4";

interface PartsSectionProps {
    parts: ServiceCallPart[];
    partsForm: {
        partName: string;
        setPartName: (val: string) => void;
        quantity: number;
        setQuantity: (val: number) => void;
        unitPrice: number;
        setUnitPrice: (val: number) => void;
    };
    handleAddPart: (e: React.FormEvent) => Promise<void>;
    totalPartsCost: number;
    loading?: boolean;
}

export default function PartsSection({
    parts,
    partsForm,
    handleAddPart,
    totalPartsCost,
    loading,
}: PartsSectionProps) {
    return (
        <section className={sectionCardClass}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Pièces utilisées
            </h2>

            <form onSubmit={handleAddPart} className="grid gap-3.5 sm:grid-cols-3 sm:items-end">
                <div className="space-y-1 sm:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom de la pièce</label>
                    <input
                        className={inputClass}
                        placeholder="ex. Joint torique"
                        value={partsForm.partName}
                        onChange={(e) => partsForm.setPartName(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quantité</label>
                    <input
                        type="number"
                        min="1"
                        className={inputClass}
                        placeholder="Quantité"
                        value={partsForm.quantity}
                        onChange={(e) => partsForm.setQuantity(Number(e.target.value))}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Prix unitaire ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className={inputClass}
                        placeholder="ex. 12.50"
                        value={partsForm.unitPrice || ""}
                        onChange={(e) => partsForm.setUnitPrice(Number(e.target.value))}
                        required
                    />
                </div>

                <div className="sm:col-span-3 pt-2">
                    <button type="submit" className={`${btnPrimaryClass} w-full`}>
                        Ajouter la pièce
                    </button>
                </div>
            </form>

            <div className="mt-4 border-t border-slate-100 dark:border-slate-800/60 pt-4 space-y-2.5">
                {loading ? (
                    <>
                        <div className="flex items-center justify-between rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/10 p-4 animate-pulse">
                            <div className="space-y-2">
                                <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-3 w-20 rounded bg-slate-150 dark:bg-slate-850" />
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="h-4 w-8 rounded bg-slate-200 dark:bg-slate-850 ml-auto" />
                                <div className="h-3 w-12 rounded bg-slate-150 dark:bg-slate-850 ml-auto" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/10 p-4 animate-pulse">
                            <div className="space-y-2">
                                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="h-3 w-24 rounded bg-slate-150 dark:bg-slate-850" />
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="h-4 w-6 rounded bg-slate-250 dark:bg-slate-850 ml-auto" />
                                <div className="h-3 w-14 rounded bg-slate-150 dark:bg-slate-850 ml-auto" />
                            </div>
                        </div>
                    </>
                ) : parts.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">Aucune pièce répertoriée.</p>
                ) : (
                    parts.map((part) => (
                        <div
                            key={part.id}
                            className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/30 dark:border-slate-800/40 p-4"
                        >
                            <div className="space-y-0.5">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {part.part_name}
                                </span>
                                <p className="text-xs text-slate-400">
                                    Prix unitaire : ${(part.unit_price || 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-900 dark:text-white">
                                    x{part.quantity}
                                </p>
                                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                                    ${(part.quantity * (part.unit_price || 0)).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 font-bold text-lg text-slate-900 dark:text-white">
                    <span>Coût total pièces</span>
                    <span className="text-cyan-600 dark:text-cyan-400">${totalPartsCost.toFixed(2)}</span>
                </div>
            </div>
        </section>
    );
}
