-- =========================================================================
-- WELO PLATFORM : MIGRATION POUR LA PRIORITÉ DES APPELS DE SERVICE
-- =========================================================================
--
-- Ce script :
-- 1. Ajoute la colonne `priority` (de type `TEXT`) à la table `public.service_calls`.
-- 2. Ajoute une contrainte check pour s'assurer que les priorités admises sont uniquement : 'low', 'medium', 'high', 'urgent'.
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
