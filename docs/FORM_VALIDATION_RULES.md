# Form Validation Rules & Error Handling - Welo Platform SaaS

This document establishes the client-side validation thresholds, error states, and message mappings for all operational workflows. It ensures consistency across all inputs and forms.

---

## 📋 Standard Validation Constraints

The Welo Platform operates on the following default constraints for client-side forms:

### 1. Client & Contact Information
- **Client Name (`clientName`):** Required. Must be between **2 and 100 characters**.
- **Address (`address`):** Required. Must contain at least a street name or building number. Min **5 characters**.
- **Email Address:** Required for user profiles/creation. Enforced via RFC 5322 compliant regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`.

### 2. Operational Asset Fields
- **Machine Serial (`machineSerial`):** Required. Min **3 characters**. Must match standard serial number alphanumeric bounds (no symbols except hyphens/slashes).
- **Issue Description (`issueDescription`):** Required. Min **10 characters** to ensure technicians have sufficient contextual information before arriving on-site. Max **1000 characters**.

### 3. Dispatch Selections
- **Technician Name:** Required if assigning. Value must be a valid, active technician from the database select list.
- **Priority:** Required. Enumerated values: `low`, `medium`, `high`, `urgent`. Default: `medium`.
- **Status:** Required. Enumerated values: `new`, `assigned`, `on_the_way`, `on_site`, `waiting_parts`, `completed`, `closed`, `cancelled`. Default: `new`.

---

## ❌ Validation Error Messaging

To maintain a low cognitive load and clear direction for users, forms must use standardized, localized validation messages:

| Field | Error Condition | Standard Message (FR) |
| :--- | :--- | :--- |
| **Client Name** | Empty / Missing | Le nom du client est requis. |
| **Client Name** | Too Short (< 2 chars) | Le nom du client doit contenir au moins 2 caractères. |
| **Address** | Empty / Missing | L'adresse est requise. |
| **Machine Serial**| Empty / Missing | Le numéro de série de la machine est requis. |
| **Description** | Empty / Missing | La description du problème est requise. |
| **Description** | Too Short (< 10 chars) | Veuillez décrire le problème plus précisément (minimum 10 caractères). |
| **Technician** | Unassigned on Assigned Column | Un technicien doit être assigné pour ce statut. |

---

## 🛡️ Validation & Error Rendering Lifecycle

1. **Focus Out (Blur) Validation:** Validate inputs when the user focuses out of a field to allow seamless typing.
2. **On Submit Block:** Prevent form submission if any validation constraint fails. Highlight all invalid fields simultaneously.
3. **Dynamic Recovery:** Once a user corrects an invalid input, clear the error border and warning message immediately.
4. **Network Failures & Retries:**
   - If a submission fails due to network issues, keep form values populated.
   - Display a global alert banner: `"Erreur de synchronisation réseau. Vos modifications sont conservées localement. [Réessayer]"`
   - Prevent layout shift when the global alert banner is toggled.

---

## 📝 Migrated Validation Log

- **ServiceCallCreateEditForm (v1.0.0):** Migrated to standard form elements. Native browser constraint validation behavior and field validation requirements (required attributes for name, technician, priority, serial, address, and description) are fully preserved. Error display styles comply with design-system validation specifications.
