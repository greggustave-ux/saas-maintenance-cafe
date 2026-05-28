"use client";

const inputClass =
    "w-full min-h-12 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15";

const btnPrimaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 px-5 py-3 text-center text-base font-semibold hover:bg-slate-800 dark:hover:bg-white active:scale-98 transition-all md:w-auto cursor-pointer";

const btnSecondaryClass =
    "flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-3 text-center text-base font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 transition-all md:w-auto cursor-pointer";

interface NewServiceCallFormProps {
    form: {
        clientName: string;
        setClientName: (val: string) => void;
        address: string;
        setAddress: (val: string) => void;
        machineSerial: string;
        setMachineSerial: (val: string) => void;
        issueDescription: string;
        setIssueDescription: (val: string) => void;
        technicianName: string;
        setTechnicianName: (val: string) => void;
    };
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onCancel: () => void;
    technicians?: { id: string; full_name: string }[];
}

export default function NewServiceCallForm({
    form,
    onSubmit,
    onCancel,
    technicians = [],
}: NewServiceCallFormProps) {
    return (
        <form
            onSubmit={onSubmit}
            className="w-full space-y-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-md animate-fade-in"
        >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Créer une nouvelle fiche d'intervention
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom du client</label>
                    <input
                        className={inputClass}
                        placeholder="ex. Acme Corp"
                        value={form.clientName}
                        onChange={(e) => form.setClientName(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technicien assigné</label>
                    <select
                        className={inputClass}
                        value={form.technicianName}
                        onChange={(e) => form.setTechnicianName(e.target.value)}
                        required
                    >
                        <option value="">Sélectionner un technicien...</option>
                        {technicians.map((tech) => (
                            <option key={tech.id} value={tech.full_name}>
                                {tech.full_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Adresse</label>
                    <input
                        className={inputClass}
                        placeholder="ex. 123 rue de la Paix, Paris"
                        value={form.address}
                        onChange={(e) => form.setAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">N° série machine</label>
                    <input
                        className={inputClass}
                        placeholder="ex. SN-847291-X"
                        value={form.machineSerial}
                        onChange={(e) => form.setMachineSerial(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description du problème</label>
                <textarea
                    className={`${inputClass} min-h-24 resize-y`}
                    placeholder="Décrivez précisément la panne signalée..."
                    value={form.issueDescription}
                    onChange={(e) => form.setIssueDescription(e.target.value)}
                    required
                />
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className={btnSecondaryClass}
                >
                    Annuler
                </button>
                <button type="submit" className={btnPrimaryClass}>
                    Créer l’appel de service
                </button>
            </div>
        </form>
    );
}
