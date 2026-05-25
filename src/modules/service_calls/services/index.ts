import { supabase } from "@/src/lib/supabase-client";
import { ServiceCall, ServiceCallPart, ServiceCallPhoto } from "../types";

// 1. Fetch all service calls
export async function getServiceCalls(): Promise<ServiceCall[]> {
    const { data, error } = await supabase
        .from("service_calls")
        .select("*")
        .order("id", { ascending: false });

    if (error) throw error;
    return data || [];
}

// 2. Fetch single service call by ID
export async function getServiceCallById(id: number): Promise<ServiceCall> {
    const { data, error } = await supabase
        .from("service_calls")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
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
    const { error } = await supabase.from("service_calls").insert(call);
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
        .select("*")
        .eq("service_call_id", serviceCallId)
        .order("id", { ascending: false });

    if (error) throw error;
    return data || [];
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
        .select("*")
        .eq("service_call_id", serviceCallId)
        .order("id", { ascending: false });

    if (error) throw error;
    return data || [];
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

    if (updateError) throw updateError;

    return data.publicUrl;
}
