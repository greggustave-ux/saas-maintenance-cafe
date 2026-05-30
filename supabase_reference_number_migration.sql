-- =========================================================================
-- WELO PLATFORM : MIGRATION POUR LES RÉFÉRENCES UNIQUES D'APPELS DE SERVICE
-- =========================================================================
--
-- Ce script :
-- 1. Crée la séquence `public.service_call_reference_seq`.
-- 2. Ajoute la colonne `reference_number` (de type `TEXT`) à la table `public.service_calls`.
-- 3. Crée la fonction trigger `handle_service_call_reference_number` pour auto-générer les numéros de référence formatés (SC-YYYY-000001) et empêcher toute modification.
-- 4. Exécute un backfill pour générer de manière unique les références de toutes les interventions existantes.
-- 5. Rend la colonne `reference_number` obligatoire (NOT NULL) et UNIQUE.
--
-- Procédure de déploiement :
-- 1. Copiez l'intégralité de ce fichier.
-- 2. Ouvrez le SQL Editor de Supabase.
-- 3. Collez le code et cliquez sur "Run".
--

-- 1. Créer la séquence pour les références
CREATE SEQUENCE IF NOT EXISTS public.service_call_reference_seq;

-- 2. Ajouter la colonne reference_number (nullable temporairement pour permettre le backfill)
ALTER TABLE public.service_calls ADD COLUMN IF NOT EXISTS reference_number text;

-- 3. Fonction trigger pour générer la référence et verrouiller la modification après création
CREATE OR REPLACE FUNCTION public.handle_service_call_reference_number()
RETURNS trigger AS $$
DECLARE
  current_year text;
  seq_val integer;
  formatted_ref text;
BEGIN
  -- A l'insertion uniquement
  IF TG_OP = 'INSERT' THEN
    IF NEW.created_at IS NOT NULL THEN
      current_year := to_char(NEW.created_at, 'YYYY');
    ELSE
      current_year := to_char(now(), 'YYYY');
    END IF;
    
    seq_val := nextval('public.service_call_reference_seq');
    formatted_ref := 'SC-' || current_year || '-' || lpad(seq_val::text, 6, '0');
    
    NEW.reference_number := formatted_ref;
    
  -- A la mise à jour (interdiction de modifier)
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.reference_number IS DISTINCT FROM OLD.reference_number THEN
      RAISE EXCEPTION 'Le numéro de référence d''un appel de service est immuable et ne peut pas être modifié après création.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Attacher le trigger
DROP TRIGGER IF EXISTS trg_service_call_reference_number ON public.service_calls;
CREATE TRIGGER trg_service_call_reference_number
  BEFORE INSERT OR UPDATE ON public.service_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_service_call_reference_number();

-- 5. Backfill des lignes existantes
DO $$
DECLARE
  r record;
  current_year text;
  seq_val integer;
  formatted_ref text;
BEGIN
  FOR r IN SELECT id, created_at FROM public.service_calls WHERE reference_number IS NULL ORDER BY id ASC LOOP
    IF r.created_at IS NOT NULL THEN
      current_year := to_char(r.created_at, 'YYYY');
    ELSE
      current_year := to_char(now(), 'YYYY');
    END IF;
    
    seq_val := nextval('public.service_call_reference_seq');
    formatted_ref := 'SC-' || current_year || '-' || lpad(seq_val::text, 6, '0');
    
    UPDATE public.service_calls
    SET reference_number = formatted_ref
    WHERE id = r.id;
  END LOOP;
END $$;

-- 6. Rendre la colonne obligatoire (NOT NULL) et UNIQUE
ALTER TABLE public.service_calls ALTER COLUMN reference_number SET NOT NULL;

-- Supprimer la contrainte unique existante si elle a déjà été créée pour éviter les erreurs
ALTER TABLE public.service_calls DROP CONSTRAINT IF EXISTS service_calls_reference_number_key;
ALTER TABLE public.service_calls ADD CONSTRAINT service_calls_reference_number_key UNIQUE (reference_number);
