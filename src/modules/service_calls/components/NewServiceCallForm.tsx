"use client";

import React from 'react';
import DSInput from "@/src/design-system/components/forms/DSInput";
import DSTextarea from "@/src/design-system/components/forms/DSTextarea";
import DSSelect from "@/src/design-system/components/forms/DSSelect";
import DSLabel from "@/src/design-system/components/forms/DSLabel";
import DSFormSection from "@/src/design-system/components/forms/DSFormSection";

const btnPrimaryClass =
    "flex min-h-[var(--touch-target-min)] w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--foreground)] text-[var(--background)] px-5 py-3 text-center text-[var(--font-size-base)] font-semibold hover:opacity-90 active:scale-98 transition-all md:w-auto cursor-pointer";

const btnSecondaryClass =
    "flex min-h-[var(--touch-target-min)] w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--foreground)]/5 text-[var(--foreground)]/80 border border-[var(--card-border)] px-5 py-3 text-center text-[var(--font-size-base)] font-semibold hover:bg-[var(--foreground)]/10 active:scale-98 transition-all md:w-auto cursor-pointer";

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
        priority: string;
        setPriority: (val: string) => void;
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
    // Safety Fallbacks
    const safeClientName = form.clientName || "";
    const safeAddress = form.address || "";
    const safeMachineSerial = form.machineSerial || "";
    const safeIssueDescription = form.issueDescription || "";
    const safeTechnicianName = form.technicianName || "";
    const safePriority = form.priority || "medium";

    return (
        <form onSubmit={onSubmit} className="w-full animate-fade-in">
            <DSFormSection title="Créer une nouvelle fiche d'intervention">
                <div className="grid gap-[var(--space-md)] sm:grid-cols-3">
                    <div className="flex flex-col gap-[var(--space-xs)]">
                        <DSLabel htmlFor="clientName" required>Nom du client</DSLabel>
                        <DSInput
                            id="clientName"
                            placeholder="ex. Acme Corp"
                            value={safeClientName}
                            onChange={(e) => form.setClientName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-[var(--space-xs)]">
                        <DSLabel htmlFor="technicianName" required>Technicien assigné</DSLabel>
                        <DSSelect
                            id="technicianName"
                            value={safeTechnicianName}
                            onChange={(e) => form.setTechnicianName(e.target.value)}
                            required
                        >
                            <option value="">Sélectionner un technicien...</option>
                            {technicians.map((tech) => (
                                <option key={tech.id} value={tech.full_name}>
                                    {tech.full_name}
                                </option>
                            ))}
                        </DSSelect>
                    </div>

                    <div className="flex flex-col gap-[var(--space-xs)]">
                        <DSLabel htmlFor="priority" required>Priorité</DSLabel>
                        <DSSelect
                            id="priority"
                            value={safePriority}
                            onChange={(e) => form.setPriority(e.target.value)}
                            required
                        >
                            <option value="low">Faible</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Élevée</option>
                            <option value="urgent">Urgente</option>
                        </DSSelect>
                    </div>
                </div>

                <div className="grid gap-[var(--space-md)] sm:grid-cols-2">
                    <div className="flex flex-col gap-[var(--space-xs)]">
                        <DSLabel htmlFor="address" required>Adresse</DSLabel>
                        <DSInput
                            id="address"
                            placeholder="ex. 123 rue de la Paix, Paris"
                            value={safeAddress}
                            onChange={(e) => form.setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-[var(--space-xs)]">
                        <DSLabel htmlFor="machineSerial" required>N° série machine</DSLabel>
                        <DSInput
                            id="machineSerial"
                            placeholder="ex. SN-847291-X"
                            value={safeMachineSerial}
                            onChange={(e) => form.setMachineSerial(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-[var(--space-xs)]">
                    <DSLabel htmlFor="issueDescription" required>Description du problème</DSLabel>
                    <DSTextarea
                        id="issueDescription"
                        placeholder="Décrivez précisément la panne signalée..."
                        value={safeIssueDescription}
                        onChange={(e) => form.setIssueDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="pt-[var(--space-sm)] flex justify-end gap-[var(--space-sm)]">
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
            </DSFormSection>
        </form>
    );
}
