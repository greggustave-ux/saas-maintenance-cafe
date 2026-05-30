import { supabase } from "@/src/lib/supabase-client";
import { ServiceCall, ServiceCallPart, ServiceCallPhoto, Machine } from "../types";

// 1. Fetch all service calls
export async function getServiceCalls(): Promise<ServiceCall[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    if (!profile) return [];

    let query = supabase
        .from("service_calls")
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, archived, archived_at, archived_by, completed_at, closed_at, reference_number, priority")
        .eq("archived", false)
        .order("id", { ascending: false });

    if (profile.role === "technician") {
        query = query.eq("technician_name", profile.full_name);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ServiceCall[] || [];
}

// Fetch all service calls with full details for Operations analysis
export async function getDetailedServiceCalls(): Promise<ServiceCall[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    if (!profile) return [];

    let query = supabase
        .from("service_calls")
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, photo_url, signature_url, created_at, archived, archived_at, archived_by, completed_at, closed_at, reference_number, priority")
        .eq("archived", false)
        .order("id", { ascending: false });

    if (profile.role === "technician") {
        query = query.eq("technician_name", profile.full_name);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ServiceCall[] || [];
}


// 2. Fetch single service call by ID
export async function getServiceCallById(id: number): Promise<ServiceCall> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non connecté.");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    if (!profile) throw new Error("Profil utilisateur introuvable.");

    const { data, error } = await supabase
        .from("service_calls")
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, photo_url, signature_url, archived, archived_at, archived_by, completed_at, closed_at, reference_number, priority")
        .eq("id", id)
        .single();

    if (error) throw error;
    if (!data) throw new Error("Intervention introuvable.");

    if (profile.role === "technician" && data.technician_name !== profile.full_name) {
        throw new Error("Accès non autorisé : Cette intervention ne vous est pas assignée.");
    }

    return data as ServiceCall;
}


// 3. Create a new service call
export async function createServiceCall(call: {
    client_name: string;
    address: string;
    machine_serial: string;
    issue_description: string;
    status: string;
    technician_name: string;
    priority?: string;
}): Promise<void> {
    const normalizedCall = {
        ...call,
        machine_serial: call.machine_serial ? call.machine_serial.trim().toLowerCase() : "",
        priority: call.priority || "medium",
    };
    const { error } = await supabase.from("service_calls").insert(normalizedCall);
    if (error) throw error;
}

// 4. Update service call status
export async function updateServiceCallStatus(id: number, status: string): Promise<void> {
    const { error } = await supabase
        .from("service_calls")
        .update({ status })
        .eq("id", id);

    if (error) throw error;
}

// 5. Delete service call
export async function deleteServiceCall(id: number): Promise<void> {
    const { error } = await supabase
        .from("service_calls")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

// 6. Save technician notes
export async function saveTechnicianNotes(id: number, notes: string): Promise<void> {
    const { error } = await supabase
        .from("service_calls")
        .update({ technician_notes: notes })
        .eq("id", id);

    if (error) throw error;
}

// 7. Get parts for a service call
export async function getServiceCallParts(serviceCallId: number): Promise<ServiceCallPart[]> {
    const { data, error } = await supabase
        .from("service_call_parts")
        .select("id, service_call_id, part_name, quantity, unit_price")
        .eq("service_call_id", serviceCallId)
        .order("id", { ascending: false });

    if (error) throw error;
    return data as ServiceCallPart[] || [];
}

// 8. Add a part to a service call
export async function addServiceCallPart(part: {
    service_call_id: number;
    part_name: string;
    quantity: number;
    unit_price: number;
}): Promise<void> {
    const { error } = await supabase.from("service_call_parts").insert(part);
    if (error) throw error;
}

// 9. Get photos for a service call
export async function getServiceCallPhotos(serviceCallId: number): Promise<ServiceCallPhoto[]> {
    const { data, error } = await supabase
        .from("service_call_photos")
        .select("id, photo_url")
        .eq("service_call_id", serviceCallId)
        .order("id", { ascending: false });

    if (error) throw error;
    return data as ServiceCallPhoto[] || [];
}

// 10. Upload intervention photo to storage and insert metadata
export async function uploadInterventionPhoto(
    serviceCallId: number,
    compressedFile: Blob
): Promise<string> {
    const filePath = `${serviceCallId}/${Date.now()}-photo.jpg`;

    // 1. Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
        .from("service-photos")
        .upload(filePath, compressedFile, {
            upsert: true,
            contentType: "image/jpeg",
        });

    if (storageError) throw storageError;

    // 2. Get Public URL
    const { data } = supabase.storage
        .from("service-photos")
        .getPublicUrl(filePath);

    // 3. Insert into Database Table
    const { error: insertError } = await supabase
        .from("service_call_photos")
        .insert({
            service_call_id: serviceCallId,
            photo_url: data.publicUrl,
        });

    if (insertError) throw insertError;

    return data.publicUrl;
}

// 11. Delete intervention photo from storage and database
export async function deleteInterventionPhoto(photoId: number, photoUrl: string): Promise<void> {
    const path = photoUrl.split("/service-photos/")[1];
    if (path) {
        // Delete from Storage
        const { error: storageError } = await supabase.storage
            .from("service-photos")
            .remove([path]);
        
        if (storageError) throw storageError;
    }

    // Delete from DB Table
    const { error: dbError } = await supabase
        .from("service_call_photos")
        .delete()
        .eq("id", photoId);

    if (dbError) throw dbError;
}

// 12. Upload signature to storage and update service call
export async function uploadClientSignature(
    serviceCallId: number,
    signatureBlob: Blob
): Promise<string> {
    const filePath = `${serviceCallId}/signature-${Date.now()}.png`;

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
        .from("service-photos")
        .upload(filePath, signatureBlob, {
            contentType: "image/png",
            upsert: true,
        });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data } = supabase.storage
        .from("service-photos")
        .getPublicUrl(filePath);

    // 3. Update Service Call table
    const { error: updateError } = await supabase
        .from("service_calls")
        .update({ signature_url: data.publicUrl })
        .eq("id", serviceCallId);

    if (updateError) {
        // Rollback signature upload from storage
        await supabase.storage
            .from("service-photos")
            .remove([filePath]);
        throw updateError;
    }

    return data.publicUrl;
}

// 13. Get service calls by machine serial
export async function getServiceCallsByMachineSerial(
    machineSerial: string
): Promise<ServiceCall[]> {
    if (!machineSerial) return [];
    const normalizedSerial = machineSerial.trim().toLowerCase();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

    if (!profile) return [];

    let query = supabase
        .from("service_calls")
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at, archived, reference_number, priority")
        .ilike("machine_serial", normalizedSerial)
        .order("id", { ascending: false });

    if (profile.role === "technician") {
        query = query.eq("technician_name", profile.full_name);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ServiceCall[] || [];
}

// 14. Get approved technicians for assignment
export async function getApprovedTechnicians(): Promise<{ id: string; full_name: string }[]> {
    const { data, error } = await supabase.rpc("get_approved_technicians_for_assignment");
    if (error) throw error;
    return data || [];
}

// 15. Update service call assigned technician
export async function updateServiceCallTechnician(id: number, technicianName: string): Promise<void> {
    const { error } = await supabase
        .from("service_calls")
        .update({ technician_name: technicianName })
        .eq("id", id);

    if (error) throw error;
}

// 15b. Fetch archived service calls (for admin & dispatcher)
export async function getArchivedServiceCalls(): Promise<ServiceCall[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "dispatcher")) {
        return [];
    }

    const { data, error } = await supabase
        .from("service_calls")
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, archived, archived_at, archived_by, completed_at, closed_at, reference_number, priority")
        .eq("archived", true)
        .order("id", { ascending: false });

    if (error) throw error;
    return data as ServiceCall[] || [];
}

// 15c. Toggle service call archiving state
export async function archiveServiceCall(id: number, archived: boolean): Promise<void> {
    const { error } = await supabase
        .from("service_calls")
        .update({ archived })
        .eq("id", id);

    if (error) throw error;
}

// 16. Get machines by client name
// TODO: client_id est basé temporairement sur le nom du client (MVP). À remplacer par une clé relationnelle plus tard.
export async function getMachinesByClientId(clientId: string): Promise<Machine[]> {
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("SUPABASE SESSION:", sessionData);
    console.log("SUPABASE USER:", sessionData?.session?.user);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from("machines")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    const machines = data as Machine[] || [];

    // Récupérer le dernier appel de service pour chaque machine
    for (const machine of machines) {
        const { data: callData } = await supabase
            .from("service_calls")
            .select("id, status, created_at, reference_number, priority")
            .ilike("machine_serial", machine.serial_number.trim().toLowerCase())
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        machine.last_service_call = callData || null;
    }

    return machines;
}

// 17. Fetch dispatcher board calls (archived = false) sorted by priority and date
export async function getDispatchBoard(): Promise<ServiceCall[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "dispatcher")) {
        return [];
    }

    const { data, error } = await supabase
        .from("service_calls")
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, created_at, archived, reference_number, priority")
        .eq("archived", false);

    if (error) throw error;
    const calls = (data as ServiceCall[] || []);

    const priorityWeight: Record<string, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
    };

    return calls.sort((a, b) => {
        const weightA = priorityWeight[a.priority || "medium"] || 2;
        const weightB = priorityWeight[b.priority || "medium"] || 2;
        if (weightA !== weightB) {
            return weightB - weightA;
        }
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });
}

// 18. Update service call priority
export async function updateServiceCallPriority(id: number, priority: string): Promise<void> {
    const { error } = await supabase
        .from("service_calls")
        .update({ priority })
        .eq("id", id);

    if (error) throw error;
}

