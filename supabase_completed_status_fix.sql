-- =========================================================================
-- WELO PLATFORM : MIGRATION DE CORRECTIF POUR LES STATUTS EN FRANÇAIS
-- =========================================================================
--
-- Ce script s'assure que tous les anciens statuts 'Terminé', 'termine' ou 'terminé'
-- sont migrés vers la nomenclature normalisée en anglais 'completed'.
--

UPDATE public.service_calls
SET status = 'completed'
WHERE status IN ('Terminé', 'termine', 'terminé');
