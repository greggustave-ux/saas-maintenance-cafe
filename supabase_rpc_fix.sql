-- MIGRATION CORRECTIVE POUR LES RPC DE GESTION DES PROFILS ET TECHNICIENS
-- Cette migration corrige l'erreur 42804 "structure of query does not match function result type"
-- causée par le type d'énumération personnalisé (app_role/app_status) retourné à la place du type attendu (text).

-- 1. DROP & CREATE de la fonction de récupération des techniciens approuvés
DROP FUNCTION IF EXISTS public.get_approved_technicians_for_assignment();

CREATE OR REPLACE FUNCTION public.get_approved_technicians_for_assignment()
RETURNS TABLE (
  id uuid,
  full_name text,
  role text
) AS $$
BEGIN
  -- Vérifier que l'utilisateur connecté est approuvé et est admin ou dispatcher
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE public.profiles.id = auth.uid() 
      AND public.profiles.approved = true 
      AND (public.profiles.role = 'admin' OR public.profiles.role = 'dispatcher')
  ) THEN
    RAISE EXCEPTION 'Non autorisé : Réservé aux administrateurs et répartiteurs.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.role::text -- Cast explicite vers text
  FROM public.profiles p
  WHERE p.approved = true AND p.role = 'technician'
  ORDER BY p.full_name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. DROP & CREATE de la fonction de lecture de tous les profils (au cas où elle rencontrerait le même problème)
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
    p.role::text, -- Cast explicite vers text
    p.approved,
    p.status::text, -- Cast explicite vers text
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
