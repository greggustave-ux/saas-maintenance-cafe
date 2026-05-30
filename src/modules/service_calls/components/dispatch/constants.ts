export const statusLabels: Record<string, string> = {
    new: "Nouveau",
    assigned: "Assigné",
    on_the_way: "En route",
    on_site: "Sur place",
    waiting_parts: "En attente de pièces",
    completed: "Terminé",
    closed: "Clos",
    cancelled: "Annulé",
};

export const statusColors: Record<string, string> = {
    new: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/25",
    assigned: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/25",
    on_the_way: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25",
    on_site: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25",
    waiting_parts: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/25",
    completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25",
    closed: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-450 border border-slate-200/30",
    cancelled: "bg-red-500/10 text-red-750 dark:text-red-400 border border-red-500/25",
};

export const priorityLabels: Record<string, string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",
    urgent: "Urgente",
};

export const priorityColors: Record<string, string> = {
    low: "bg-slate-500/10 text-slate-650 dark:text-slate-400 border border-slate-500/25",
    medium: "bg-blue-500/10 text-blue-750 dark:text-blue-400 border border-blue-500/25",
    high: "bg-orange-500/10 text-orange-705 dark:text-orange-400 border border-orange-500/20",
    urgent: "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25",
};

export const KANBAN_COLUMNS = [
    "new",
    "assigned",
    "on_the_way",
    "on_site",
    "waiting_parts",
    "completed",
];
