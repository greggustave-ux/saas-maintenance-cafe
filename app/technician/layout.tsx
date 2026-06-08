import React from "react";
import TechnicianMobileShell from "@/src/modules/technician/components/TechnicianMobileShell";

export const metadata = {
  title: "Espace Technicien - Welo",
  description: "Plateforme Welo d'interventions mobiles sur site",
};

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TechnicianMobileShell>{children}</TechnicianMobileShell>;
}
