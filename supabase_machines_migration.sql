-- =========================================================================
-- WELO PLATFORM : MIGRATION DES MACHINES ET PROFILS
-- =========================================================================
--
-- Ce script :
-- 1. Ajoute les colonnes entreprise (company) et téléphone (phone) à profiles.
-- 2. Crée la table `machines` pour stocker les équipements sur place.
-- 3. Configure la sécurité RLS sur la table `machines`.
-- 4. Insère des données de test réalistes pour vérifier l'affichage.
--
-- Procédure de déploiement :
-- 1. Copiez l'intégralité de ce fichier.
-- 2. Ouvrez le SQL Editor de Supabase.
-- 3. Collez le code et cliquez sur "Run".
--

-- ==========================================
-- 1. ENRICHISSEMENT DE LA TABLE PROFILES
-- ==========================================

-- Ajout des colonnes entreprise et téléphone à profiles si elles n'existent pas
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Mise à jour ou création du trigger d'inscription pour copier ces métadonnées de auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, approved, status, company, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'technician'::public.app_role, -- Force le rôle de technicien par défaut (protection contre l'élévation de privilèges)
    false, -- Non approuvé par défaut
    'pending'::public.app_status, -- Statut en attente
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Redéfinition de la fonction pour lire les profils avec entreprise et téléphone
DROP FUNCTION IF EXISTS public.get_all_profiles_for_admin();
CREATE OR REPLACE FUNCTION public.get_all_profiles_for_admin()
RETURNS TABLE (
  id uuid,
  full_name text,
  role text,
  approved boolean,
  status text,
  approved_at timestamp with time zone,
  approved_by uuid,
  created_at timestamp with time zone,
  email text,
  company text,
  phone text
) AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Non autorisé : Réservé aux administrateurs.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.role::text,
    p.approved,
    p.status::text,
    p.approved_at,
    p.approved_by,
    p.created_at,
    u.email::text,
    p.company,
    p.phone
  FROM public.profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  ORDER BY 
    CASE p.status 
      WHEN 'pending' THEN 1 
      WHEN 'approved' THEN 2 
      WHEN 'rejected' THEN 3 
      WHEN 'blocked' THEN 4 
      ELSE 5 
    END, 
    p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================
-- 2. CRÉATION DE LA TABLE MACHINES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.machines (
    id BIGSERIAL PRIMARY KEY,
    client_id TEXT NOT NULL, -- TODO: À remplacer par une clé étrangère vers une table `clients` dans le futur pour éviter la duplication
    model TEXT NOT NULL,
    serial_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CONSTRAINT check_machine_status CHECK (status IN ('active', 'inactive', 'in_repair', 'replaced')),
    ownership_type TEXT NOT NULL CONSTRAINT check_machine_ownership CHECK (ownership_type IN ('purchased', 'rented', 'unknown')),
    location_details TEXT,
    installed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser les jointures et recherches
CREATE INDEX IF NOT EXISTS idx_machines_client_id ON public.machines(client_id);
CREATE INDEX IF NOT EXISTS idx_machines_serial_number ON public.machines(serial_number);

-- ==========================================
-- 3. CONFIGURATION RLS (ROW LEVEL SECURITY)
-- ==========================================

ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques si existantes pour éviter les doublons
DROP POLICY IF EXISTS machines_admin_all ON public.machines;
DROP POLICY IF EXISTS machines_read_approved ON public.machines;

-- Politique 1 : Les administrateurs peuvent tout faire
CREATE POLICY machines_admin_all ON public.machines
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Politique 2 : Les utilisateurs connectés approuvés (techs, dispatchers, etc.) peuvent lire
CREATE POLICY machines_read_approved ON public.machines
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.approved = true
        )
    );

-- ==========================================
-- 4. INSERTION DE DONNÉES DE TEST REALISTES
-- ==========================================

-- Nettoyage des anciennes données de test si besoin
DELETE FROM public.machines WHERE client_id IN ('Restaurant Le Gourmet', 'Boulangerie Le Bon Pain', 'Café des Arts', 'Garage Auto-Tech');

INSERT INTO public.machines (client_id, model, serial_number, status, ownership_type, location_details, installed_at)
VALUES 
  (
    'Restaurant Le Gourmet', 
    'Four Rationnel iCombi Pro 10', 
    'mc-7003-problem', 
    'in_repair', 
    'purchased', 
    'Cuisine principale - Section cuisson', 
    now() - interval '2 years'
  ),
  (
    'Restaurant Le Gourmet', 
    'Lave-vaisselle Hobart AM15', 
    'mc-Hobart-Gourmet', 
    'active', 
    'rented', 
    'Plonge arrière', 
    now() - interval '1 year'
  ),
  (
    'Boulangerie Le Bon Pain', 
    'Pétrin Spirale VMI 80L', 
    'mc-8002-monitor', 
    'active', 
    'rented', 
    'Laboratoire boulangerie', 
    now() - interval '3 years'
  ),
  (
    'Café des Arts', 
    'La Marzocco Linea PB 2-Gr', 
    'mc-9001-stable', 
    'active', 
    'purchased', 
    'Comptoir principal - Barista', 
    now() - interval '6 months'
  ),
  (
    'Garage Auto-Tech', 
    'Compresseur Chicago Pneumatic', 
    'mc-CP-Compressor', 
    'inactive', 
    'unknown', 
    'Local technique compresseur', 
    now() - interval '4 years'
  );
