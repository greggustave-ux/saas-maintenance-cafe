import { supabase } from "@/src/lib/supabase-client";
import { ServiceCall, ServiceCallPart, ServiceCallPhoto } from "../types";

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
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name")
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
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, photo_url, signature_url, created_at")
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
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, photo_url, signature_url")
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
}): Promise<void> {
    const normalizedCall = {
        ...call,
        machine_serial: call.machine_serial ? call.machine_serial.trim().toLowerCase() : "",
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
        .select("id, client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at")
        .ilike("machine_serial", normalizedSerial)
        .order("id", { ascending: false });

    if (profile.role === "technician") {
        query = query.eq("technician_name", profile.full_name);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ServiceCall[] || [];
}
