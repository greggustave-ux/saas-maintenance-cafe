import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ServiceCall, ServiceCallPart, ServiceCallPhoto } from "../types";
import * as api from "../services";
import { compressImageForUpload } from "@/src/lib/compress-image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export type UploadStatus = "idle" | "compressing" | "uploading" | "saving" | "success" | "error";

// ==========================================
// 1. Hook for Service Calls List Page
// ==========================================
export function useServiceCalls() {
    const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form inputs state
    const [clientName, setClientName] = useState("");
    const [address, setAddress] = useState("");
    const [machineSerial, setMachineSerial] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [technicianName, setTechnicianName] = useState("");

    const isFetchingRef = useRef(false);

    const fetchServiceCalls = useCallback(async (force = false) => {
        if (isFetchingRef.current && !force) return;
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
        try {
            const data = await api.getServiceCalls();
            setServiceCalls(data);
        } catch (err: any) {
            const msg = err.message || "Erreur lors du chargement des interventions.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("fetchServiceCalls error:", err);
            }
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    useEffect(() => {
        fetchServiceCalls();
    }, [fetchServiceCalls]);

    const handleCreateServiceCall = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        try {
            await api.createServiceCall({
                client_name: clientName,
                address,
                machine_serial: machineSerial,
                issue_description: issueDescription,
                status: "En attente",
                technician_name: technicianName,
            });

            // Reset form
            setClientName("");
            setAddress("");
            setMachineSerial("");
            setIssueDescription("");
            setTechnicianName("");
            setIsFormOpen(false);

            setSuccessMessage("Intervention créée avec succès.");
            setTimeout(() => setSuccessMessage(null), 3000);

            // Reload list
            await fetchServiceCalls(true);
        } catch (err: any) {
            const msg = err.message || "Erreur lors de la création de la fiche.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("createServiceCall error:", err);
            }
        }
    }, [clientName, address, machineSerial, issueDescription, technicianName, fetchServiceCalls]);

    const handleUpdateStatus = useCallback(async (id: number, status: string) => {
        setError(null);
        setSuccessMessage(null);
        try {
            await api.updateServiceCallStatus(id, status);
            setServiceCalls((prev) =>
                prev.map((call) => (call.id === id ? { ...call, status } : call))
            );
            setSuccessMessage("Statut mis à jour.");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            const msg = err.message || "Erreur lors de la mise à jour du statut.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("updateStatus error:", err);
            }
        }
    }, []);

    const handleDeleteServiceCall = useCallback(async (id: number) => {
        const confirmDelete = window.confirm("Supprimer cet appel de service ?");
        if (!confirmDelete) return;

        setError(null);
        setSuccessMessage(null);
        try {
            await api.deleteServiceCall(id);
            setServiceCalls((prev) => prev.filter((call) => call.id !== id));
            setSuccessMessage("Intervention supprimée.");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            const msg = err.message || "Erreur lors de la suppression de l'appel.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("deleteServiceCall error:", err);
            }
        }
    }, []);

    const filteredCalls = useMemo(() => {
        const term = search.toLowerCase();
        return serviceCalls.filter((call) =>
            call.client_name.toLowerCase().includes(term) ||
            (call.machine_serial && call.machine_serial.toLowerCase().includes(term)) ||
            call.address.toLowerCase().includes(term)
        );
    }, [serviceCalls, search]);

    return {
        serviceCalls,
        search,
        setSearch,
        isFormOpen,
        setIsFormOpen,
        loading,
        error,
        setError,
        successMessage,
        setSuccessMessage,
        form: {
            clientName,
            setClientName,
            address,
            setAddress,
            machineSerial,
            setMachineSerial,
            issueDescription,
            setIssueDescription,
            technicianName,
            setTechnicianName,
        },
        handleCreateServiceCall,
        handleUpdateStatus,
        handleDeleteServiceCall,
        filteredCalls,
        refresh: fetchServiceCalls,
    };
}

// ==========================================
// 2. Hook for Service Call Details Page
// ==========================================
export function useServiceCallDetails(id: number) {
    const [serviceCall, setServiceCall] = useState<ServiceCall | null>(null);
    const [notes, setNotes] = useState("");
    const [parts, setParts] = useState<ServiceCallPart[]>([]);
    const [photos, setPhotos] = useState<ServiceCallPhoto[]>([]);

    // Form inputs state for parts
    const [partName, setPartName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);

    // Operation loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [savingSignature, setSavingSignature] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

    const [machineHistory, setMachineHistory] = useState<ServiceCall[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const isFetchingRef = useRef(false);

    const refreshParts = useCallback(async () => {
        try {
            const data = await api.getServiceCallParts(id);
            setParts(data);
        } catch (err: any) {
            if (process.env.NODE_ENV === "development") {
                console.error("fetchParts error:", err);
            }
        }
    }, [id]);

    const refreshPhotos = useCallback(async () => {
        try {
            const data = await api.getServiceCallPhotos(id);
            setPhotos(data);
        } catch (err: any) {
            if (process.env.NODE_ENV === "development") {
                console.error("fetchPhotos error:", err);
            }
        }
    }, [id]);

    const fetchDetails = useCallback(async (force = false) => {
        if (isFetchingRef.current && !force) return;
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
        try {
            const details = await api.getServiceCallById(id);
            setServiceCall(details);
            setNotes(details.technician_notes || "");
            
            // Fetch associated lists
            const [partsData, photosData] = await Promise.all([
                api.getServiceCallParts(id),
                api.getServiceCallPhotos(id),
            ]);
            setParts(partsData);
            setPhotos(photosData);

            if (details.machine_serial) {
                setHistoryLoading(true);
                try {
                    const historyData = await api.getServiceCallsByMachineSerial(details.machine_serial);
                    setMachineHistory(historyData);
                } catch (hErr) {
                    if (process.env.NODE_ENV === "development") {
                        console.error("fetchMachineHistory error:", hErr);
                    }
                } finally {
                    setHistoryLoading(false);
                }
            }
        } catch (err: any) {
            const msg = err.message || "Erreur lors de la récupération des détails de l'intervention.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("fetchDetails error:", err);
            }
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleSaveNotes = useCallback(async () => {
        setError(null);
        setSuccessMessage(null);
        try {
            await api.saveTechnicianNotes(id, notes);
            setServiceCall((prev) => (prev ? { ...prev, technician_notes: notes } : null));
            setSuccessMessage("Notes d'intervention enregistrées.");
            setTimeout(() => setSuccessMessage(null), 3000);
            return true;
        } catch (err: any) {
            const msg = err.message || "Erreur lors de la sauvegarde des notes.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("saveNotes error:", err);
            }
            return false;
        }
    }, [id, notes]);

    const handleAddPart = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        try {
            await api.addServiceCallPart({
                service_call_id: id,
                part_name: partName,
                quantity,
                unit_price: unitPrice,
            });

            setPartName("");
            setQuantity(1);
            setUnitPrice(0);
            
            setSuccessMessage("Pièce ajoutée avec succès.");
            setTimeout(() => setSuccessMessage(null), 3000);

            await refreshParts();
        } catch (err: any) {
            const msg = err.message || "Erreur lors de l'ajout de la pièce.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("addPart error:", err);
            }
        }
    }, [id, partName, quantity, unitPrice, refreshParts]);

    const handleUploadPhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const file = input.files?.[0];
        if (!file) return;

        setUploadError(null);
        setUploadStatus("compressing");

        try {
            const compressed = await compressImageForUpload(file);
            setUploadStatus("uploading");
            
            await api.uploadInterventionPhoto(id, compressed);
            setUploadStatus("saving");
            
            await refreshPhotos();
            setUploadStatus("success");
            setSuccessMessage("Photo ajoutée avec succès.");
            setTimeout(() => {
                setSuccessMessage(null);
                setUploadStatus("idle");
            }, 3000);
        } catch (err: any) {
            const msg = err.message || "Échec du téléversement de la photo.";
            setUploadError(msg);
            setUploadStatus("error");
            if (process.env.NODE_ENV === "development") {
                console.error("uploadPhoto error:", err);
            }
        } finally {
            input.value = "";
        }
    }, [id, refreshPhotos]);

    const handleDeletePhoto = useCallback(async (photoId: number, photoUrl: string) => {
        const confirmDelete = window.confirm("Supprimer cette photo ?");
        if (!confirmDelete) return;

        setError(null);
        setSuccessMessage(null);
        try {
            await api.deleteInterventionPhoto(photoId, photoUrl);
            setPhotos((prev) => prev.filter((p) => p.id !== photoId));
            setSuccessMessage("Photo supprimée.");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            const msg = err.message || "Impossible de supprimer la photo.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("deletePhoto error:", err);
            }
        }
    }, []);

    const handleSaveSignature = useCallback(async (signatureCanvasInstance: any) => {
        if (!signatureCanvasInstance) return;

        if (signatureCanvasInstance.isEmpty()) {
            setError("La signature est vide.");
            return;
        }

        setSavingSignature(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const dataUrl = signatureCanvasInstance.getTrimmedCanvas().toDataURL("image/png");
            const blob = await fetch(dataUrl).then((res) => res.blob());
            const publicUrl = await api.uploadClientSignature(id, blob);

            setServiceCall((prev) => (prev ? { ...prev, signature_url: publicUrl } : null));
            setSuccessMessage("Signature client enregistrée.");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            const msg = err.message || "Erreur lors de la sauvegarde de la signature.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("saveSignature error:", err);
            }
        } finally {
            setSavingSignature(false);
        }
    }, [id]);

    const handleDownloadPdf = useCallback(async (printTemplateId: string) => {
        const element = document.getElementById(printTemplateId);
        if (!element || !serviceCall) return;

        setGeneratingPdf(true);
        setError(null);

        try {
            element.style.display = "block";
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            element.style.display = "none";

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`rapport-intervention-${serviceCall.id}.pdf`);
        } catch (err: any) {
            const msg = "Impossible de générer le PDF. Les images n'ont peut-être pas des permissions CORS valides.";
            setError(msg);
            if (process.env.NODE_ENV === "development") {
                console.error("downloadPdf error:", err);
            }
        } finally {
            setGeneratingPdf(false);
        }
    }, [serviceCall]);

    const totalPartsCost = useMemo(() => {
        return parts.reduce((sum, p) => sum + p.quantity * (p.unit_price || 0), 0);
    }, [parts]);

    return {
        serviceCall,
        setServiceCall,
        notes,
        setNotes,
        parts,
        photos,
        loading,
        error,
        setError,
        successMessage,
        setSuccessMessage,
        uploadStatus,
        uploadError,
        savingSignature,
        generatingPdf,
        activePhotoModal,
        setActivePhotoModal,
        partsForm: {
            partName,
            setPartName,
            quantity,
            setQuantity,
            unitPrice,
            setUnitPrice,
        },
        totalPartsCost,
        handleSaveNotes,
        handleAddPart,
        handleUploadPhoto,
        handleDeletePhoto,
        handleSaveSignature,
        handleDownloadPdf,
        refresh: fetchDetails,
        machineHistory,
        historyLoading,
    };
}
