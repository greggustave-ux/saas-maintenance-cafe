-- 1. Fonction sécurisée pour lire tous les profils (réservée aux admins)
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

-- 2. Fonction sécurisée pour modifier un profil (réservée aux admins, protection auto-dégradation)
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  target_user_id uuid,
  new_role text,
  new_status text
)
RETURNS void AS $$
BEGIN
  -- Vérification des privilèges de l'appelant
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Non autorisé : Réservé aux administrateurs.';
  END IF;

  -- Sécurité anti-auto-dégradation et auto-blocage/auto-rejet
  IF target_user_id = auth.uid() AND new_role != 'admin' THEN
    RAISE EXCEPTION 'Action interdite : Vous ne pouvez pas vous retirer votre propre rôle administrateur.';
  END IF;

  IF target_user_id = auth.uid() AND new_status != 'approved' THEN
    RAISE EXCEPTION 'Action interdite : Vous ne pouvez pas vous bloquer, vous rejeter ou désapprouver votre propre compte.';
  END IF;

  -- Mise à jour du profil cible
  UPDATE public.profiles
  SET 
    role = new_role::public.app_role,
    status = new_status::public.app_status,
    approved = (new_status = 'approved'),
    approved_at = CASE WHEN new_status = 'approved' THEN now() ELSE approved_at END,
    approved_by = CASE WHEN new_status = 'approved' THEN auth.uid() ELSE approved_by END
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Fonction sécurisée pour récupérer les techniciens approuvés pour l'assignation
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
    p.role::text
  FROM public.profiles p
  WHERE p.approved = true AND p.role = 'technician'
  ORDER BY p.full_name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


