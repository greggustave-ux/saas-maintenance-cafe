export type ServiceCall = {
    id: number;
    client_name: string;
    address: string;
    machine_serial: string;
    issue_description: string;
    status: string;
    technician_name: string;
    technician_notes: string | null;
    photo_url: string | null;
    signature_url: string | null;
    created_at?: string;
};

export type ServiceCallPart = {
    id: number;
    service_call_id: number;
    part_name: string;
    quantity: number;
    unit_price: number;
};

export type ServiceCallPhoto = {
    id: number;
    photo_url: string;
};

export type Machine = {
    id: number;
    client_id: string; // Nom du client pour le MVP (TODO: Remplacer par un client_id numérique lié à une table clients dans le futur)
    model: string;
    serial_number: string;
    status: "active" | "inactive" | "in_repair" | "replaced";
    ownership_type: "purchased" | "rented" | "unknown";
    location_details: string | null;
    installed_at: string | null;
    created_at?: string;
    updated_at?: string;
    last_service_call?: {
        id: number;
        status: string;
        created_at: string;
    } | null;
};

