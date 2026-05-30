-- =========================================================================
-- WELO PLATFORM : MIGRATION POUR LA PRIORITÉ DES APPELS DE SERVICE
-- =========================================================================
--
-- Ce script :
-- 1. Ajoute la colonne `priority` (de type `TEXT`) à la table `public.service_calls`.
-- 2. Ajoute une contrainte check pour s'assurer que les priorités admises sont uniquement : 'low', 'medium', 'high', 'urgent'.
-- 3. Ajoute des index de performance pour optimiser les filtres et tris du Kanban.
-- 4. Crée un trigger de sécurité interdisant aux techniciens (non admin / non dispatcher) de modifier la priorité.
--
-- Procédure de déploiement :
-- 1. Copiez l'intégralité de ce fichier.
-- 2. Ouvrez le SQL Editor de Supabase.
-- 3. Collez le code et cliquez sur "Run".
--

-- 1. Ajouter la colonne priority (valeur par défaut : 'medium')
ALTER TABLE public.service_calls ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium' NOT NULL;

-- 2. Ajouter la contrainte check de validation
ALTER TABLE public.service_calls DROP CONSTRAINT IF EXISTS check_service_calls_priority;
ALTER TABLE public.service_calls ADD CONSTRAINT check_service_calls_priority
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- 3. Index de performance pour les filtres et le tri
CREATE INDEX IF NOT EXISTS idx_service_calls_priority
ON public.service_calls(priority);

CREATE INDEX IF NOT EXISTS idx_service_calls_archived_status_priority
ON public.service_calls(archived, status, priority, created_at);

-- 4. Trigger de sécurité pour restreindre la modification de la priorité
CREATE OR REPLACE FUNCTION public.handle_service_call_priority_security()
RETURNS trigger AS $$
BEGIN
  IF NEW.priority IS DISTINCT FROM OLD.priority THEN
    -- Vérifier si l'utilisateur actif est un admin ou un dispatcher
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND profiles.approved = true AND (
        role = 'admin'::public.app_role OR
        role = 'dispatcher'::public.app_role
      )
    ) THEN
      RAISE EXCEPTION 'Non autorisé : Seuls les administrateurs et répartiteurs peuvent modifier la priorité des interventions.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_service_call_priority_security ON public.service_calls;
CREATE TRIGGER trg_service_call_priority_security
  BEFORE UPDATE ON public.service_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_service_call_priority_security();
