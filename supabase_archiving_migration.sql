-- =========================================================================
-- WELO PLATFORM : MIGRATION POUR L'ARCHIVAGE DES APPELS DE SERVICE
-- =========================================================================
--
-- Ce script :
-- 1. Ajoute les colonnes d'archivage et de timestamps à `service_calls`.
-- 2. Migre les anciens statuts en français vers la nouvelle nomenclature en anglais.
-- 3. Ajoute une contrainte check pour valider la liste des nouveaux statuts.
-- 4. Crée un trigger pour gérer automatiquement `completed_at` et `closed_at`.
-- 5. Crée un trigger pour gérer automatiquement `archived_at`, `archived_by`
--    et sécuriser l'archivage (réservé aux admins/dispatchers).
-- 6. Configure les politiques RLS sur `service_calls`.
--
-- Procédure de déploiement :
-- 1. Copiez l'intégralité de ce fichier.
-- 2. Ouvrez le SQL Editor de Supabase.
-- 3. Collez le code et cliquez sur "Run".
--

-- ==========================================
-- 1. ENRICHISSEMENT DE LA TABLE SERVICE_CALLS
-- ==========================================

ALTER TABLE public.service_calls ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE public.service_calls ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE NULL;
ALTER TABLE public.service_calls ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES public.profiles(id) NULL;
ALTER TABLE public.service_calls ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE NULL;
ALTER TABLE public.service_calls ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE NULL;

-- ==========================================
-- 2. MIGRATION DES STATUTS & CONTRAINTES
-- ==========================================

-- Migration des statuts français existants
UPDATE public.service_calls
SET status = 'new'
WHERE status = 'En attente';

UPDATE public.service_calls
SET status = 'on_site'
WHERE status = 'En cours';

UPDATE public.service_calls
SET status = 'completed'
WHERE status = 'Terminé';

-- Si d'autres valeurs existent, les forcer à 'new'
UPDATE public.service_calls
SET status = 'new'
WHERE status NOT IN ('new', 'assigned', 'on_the_way', 'on_site', 'waiting_parts', 'completed', 'closed', 'cancelled');

-- Suppression dynamique de toute contrainte check existante sur le status
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
        WHERE nsp.nspname = 'public'
          AND rel.relname = 'service_calls'
          AND con.contype = 'c'
          AND con.consrc LIKE '%status%'
    LOOP
        EXECUTE 'ALTER TABLE public.service_calls DROP CONSTRAINT ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- Ajout de la nouvelle contrainte check
ALTER TABLE public.service_calls ADD CONSTRAINT check_service_calls_status
CHECK (status IN ('new', 'assigned', 'on_the_way', 'on_site', 'waiting_parts', 'completed', 'closed', 'cancelled'));

-- ==========================================
-- 3. TRIGGERS POUR TIMESTAMPS ET ARCHIVAGE
-- ==========================================

-- Trigger 1 : Renseignement automatique de completed_at et closed_at selon le statut
CREATE OR REPLACE FUNCTION public.handle_service_call_status_timestamps()
RETURNS trigger AS $$
BEGIN
  -- completed_at
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed' OR NEW.completed_at IS NULL) THEN
    NEW.completed_at := now();
  ELSIF NEW.status IS DISTINCT FROM 'completed' AND OLD.status = 'completed' THEN
    NEW.completed_at := NULL;
  END IF;

  -- closed_at
  IF NEW.status = 'closed' AND (OLD.status IS DISTINCT FROM 'closed' OR NEW.closed_at IS NULL) THEN
    NEW.closed_at := now();
  ELSIF NEW.status IS DISTINCT FROM 'closed' AND OLD.status = 'closed' THEN
    NEW.closed_at := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_service_call_status_timestamps ON public.service_calls;
CREATE TRIGGER trg_service_call_status_timestamps
  BEFORE INSERT OR UPDATE ON public.service_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_service_call_status_timestamps();


-- Trigger 2 : Logique d'archivage (audit et restriction de sécurité)
CREATE OR REPLACE FUNCTION public.handle_service_call_archiving_rules()
RETURNS trigger AS $$
BEGIN
  -- Vérifier si les colonnes d'archivage sont modifiées
  IF TG_OP = 'UPDATE' AND (
    NEW.archived IS DISTINCT FROM OLD.archived OR
    NEW.archived_at IS DISTINCT FROM OLD.archived_at OR
    NEW.archived_by IS DISTINCT FROM OLD.archived_by
  ) THEN
    -- Sécurité : Vérifier le rôle de l'utilisateur actif
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin'::public.app_role OR role = 'dispatcher'::public.app_role)
    ) THEN
      RAISE EXCEPTION 'Non autorisé : Seuls les administrateurs et répartiteurs peuvent archiver ou désarchiver des interventions.';
    END IF;

    -- Remplissage automatique
    IF NEW.archived = true AND OLD.archived = false THEN
      NEW.archived_at := now();
      NEW.archived_by := auth.uid();
    ELSIF NEW.archived = false AND OLD.archived = true THEN
      NEW.archived_at := NULL;
      NEW.archived_by := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_service_call_archiving_rules ON public.service_calls;
CREATE TRIGGER trg_service_call_archiving_rules
  BEFORE UPDATE ON public.service_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_service_call_archiving_rules();

-- ==========================================
-- 4. CONFIGURATION RLS (ROW LEVEL SECURITY)
-- ==========================================

ALTER TABLE public.service_calls ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques si existantes pour repartir sur de bonnes bases
DROP POLICY IF EXISTS service_calls_select ON public.service_calls;
DROP POLICY IF EXISTS service_calls_insert ON public.service_calls;
DROP POLICY IF EXISTS service_calls_update ON public.service_calls;
DROP POLICY IF EXISTS service_calls_delete ON public.service_calls;

-- Politique 1 : Lecture des appels
-- Les admins et dispatchers peuvent tout lire.
-- Les techniciens ne lisent que les appels qui leur sont assignés (par nom complet).
CREATE POLICY service_calls_select ON public.service_calls
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.approved = true AND (
        profiles.role = 'admin'::public.app_role OR
        profiles.role = 'dispatcher'::public.app_role OR
        (profiles.role = 'technician'::public.app_role AND service_calls.technician_name = profiles.full_name)
      )
    )
  );

-- Politique 2 : Insertion des appels
-- Seuls les admins et dispatchers peuvent créer des interventions.
CREATE POLICY service_calls_insert ON public.service_calls
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.approved = true AND (
        profiles.role = 'admin'::public.app_role OR
        profiles.role = 'dispatcher'::public.app_role
      )
    )
  );

-- Politique 3 : Modification des appels
-- Les admins/dispatchers peuvent tout modifier.
-- Les techniciens peuvent modifier uniquement s'ils sont assignés à l'intervention.
CREATE POLICY service_calls_update ON public.service_calls
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.approved = true AND (
        profiles.role = 'admin'::public.app_role OR
        profiles.role = 'dispatcher'::public.app_role OR
        (profiles.role = 'technician'::public.app_role AND service_calls.technician_name = profiles.full_name)
      )
    )
  );

-- Politique 4 : Suppression des appels
-- Réservée aux administrateurs.
CREATE POLICY service_calls_delete ON public.service_calls
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.app_role
    )
  );
