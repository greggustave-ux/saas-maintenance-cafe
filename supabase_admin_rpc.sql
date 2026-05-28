-- 1. Fonction sécurisée pour lire tous les profils (réservée aux admins)
CREATE OR REPLACE FUNCTION public.get_all_profiles_for_admin()
RETURNS TABLE (
  id uuid,
  full_name text,
  role text,
  approved boolean,
  approved_at timestamp with time zone,
  approved_by uuid,
  created_at timestamp with time zone,
  email text
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
    p.role,
    p.approved,
    p.approved_at,
    p.approved_by,
    p.created_at,
    u.email::text
  FROM public.profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  ORDER BY p.approved ASC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fonction sécurisée pour modifier un profil (réservée aux admins, protection auto-dégradation)
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  target_user_id uuid,
  new_role text,
  new_approved boolean
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

  -- Sécurité anti-auto-dégradation et auto-désapprobation
  IF target_user_id = auth.uid() AND new_role != 'admin' THEN
    RAISE EXCEPTION 'Action interdite : Vous ne pouvez pas vous retirer votre propre rôle administrateur.';
  END IF;

  IF target_user_id = auth.uid() AND new_approved = false THEN
    RAISE EXCEPTION 'Action interdite : Vous ne pouvez pas désapprouver votre propre compte.';
  END IF;

  -- Mise à jour du profil cible
  UPDATE public.profiles
  SET 
    role = new_role,
    approved = new_approved,
    approved_at = CASE WHEN new_approved = true THEN now() ELSE NULL END,
    approved_by = CASE WHEN new_approved = true THEN auth.uid() ELSE NULL END
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Fonction sécurisée pour récupérer les techniciens approuvés pour l'assignation
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
    p.role
  FROM public.profiles p
  WHERE p.approved = true AND p.role = 'technician'
  ORDER BY p.full_name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

