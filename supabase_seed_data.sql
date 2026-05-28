-- =========================================================================
-- WELO PLATFORM : SEED DATA GENERATOR (50 REALISTIC INTERVENTIONS)
-- =========================================================================
--
-- Ce script injecte 50 appels de service fictifs et leurs pièces associées.
-- Toutes les données injectées sont marquées par le suffixe "[TEST-DATA]"
-- dans la description du problème pour faciliter le repérage et la suppression.
--
-- Procédure de déploiement :
-- 1. Copiez l'intégralité de ce fichier.
-- 2. Ouvrez le SQL Editor de Supabase.
-- 3. Collez le code et cliquez sur "Run".
--

DO $$
DECLARE
  new_call_id integer;
  i integer;
  
  -- Pools de données
  clients text[] := ARRAY[
    'Boulangerie Le Bon Pain',
    'Hôtel Plaza Québec',
    'Café des Arts',
    'Garage Auto-Tech',
    'Entrepôt Logi-Nord',
    'Usine Métal-Tech',
    'Restaurant Le Gourmet'
  ];
  
  addresses text[] := ARRAY[
    '120 Rue Saint-Jean, Québec',
    '3030 Boulevard Laurier, Québec',
    '45 Rue Garneau, Québec',
    '850 Avenue Cartier, Québec',
    '1500 Rue de l''Entrepôt, Lévis',
    '2200 Boulevard Wilfrid-Hamel, Québec',
    '75 Grande Allée E, Québec'
  ];
  
  techs text[] := ARRAY[
    'Jean Dupuis',
    'Marc Lavoie',
    'Sophie Morin',
    'Antoine Bouchard'
  ];
  
  serials text[] := ARRAY[
    'MC-1010-XYZ',
    'MC-2020-ABC',
    'MC-3030-DEF',
    'MC-4040-GHI',
    'MC-5050-JKL',
    'MC-1111-AAA',
    'MC-2222-BBB',
    'MC-3333-CCC'
  ];
  
  issues text[] := ARRAY[
    'Erreur de surchauffe et arrêt de sécurité',
    'Fuite de liquide hydraulique sous le bac principal',
    'Bruit anormal de broyage lors de la mise en marche',
    'Problème de température fluctuante sur le circuit',
    'Electrovanne bloquée en position fermée',
    'Pression faible dans le circuit d''admission',
    'Pompe principale désamorcée et bloquée',
    'Entretien préventif trimestriel et nettoyage'
  ];

  notes_pool text[] := ARRAY[
    'Nettoyage du filtre effectué et test de redémarrage OK.',
    'Remplacement de l''électrovanne défectueuse, fuite résolue.',
    'Remplacement du joint torique usé et appoint de fluide hydraulique.',
    'Sonde de température calibrée, cycles de chauffe normaux.',
    'Pompe principale nettoyée, déblocage de l''axe du moteur.',
    'Remplacement de la carte électronique défectueuse, programmation OK.',
    'Changement du filtre d''admission d''air et calibration de la pression.',
    'Maintenance préventive complète, aucun problème détecté.'
  ];

  parts_pool text[] := ARRAY[
    'Filtre d''admission',
    'Electrovanne',
    'Joint torique',
    'Sonde température',
    'Pompe à eau',
    'Carte électronique',
    'Filtre à air',
    'Moteur de rechange'
  ];

  prices_pool numeric[] := ARRAY[
    65.00,
    145.00,
    45.00,
    115.00,
    320.00,
    580.00,
    75.00,
    480.00
  ];

  -- Variables de boucle
  rand_client_idx integer;
  rand_tech_idx integer;
  rand_serial_idx integer;
  rand_issue_idx integer;
  rand_notes_idx integer;
  rand_status text;
  rand_date timestamp with time zone;
BEGIN
  -- 1. Nettoyage des anciennes données de test injectées pour éviter l'accumulation
  DELETE FROM public.service_call_parts WHERE service_call_id IN (SELECT id FROM public.service_calls WHERE issue_description LIKE '%[TEST-DATA]%');
  DELETE FROM public.service_calls WHERE issue_description LIKE '%[TEST-DATA]%';

  -- =========================================================================
  -- SCÉNARIOS DÉTERMINISTES REQUIS POUR TESTER MACHINE INTELLIGENCE
  -- =========================================================================

  -- SCÉNARIO 1 : Machine mc-7003-problem (Problématique - Score de Risque ~ 85+)
  -- 4 interventions sur 90 jours (dont 2 en 30 jours), pièces répétées, mots-clés de pannes, pas de photo ni signature.
  
  -- Intervention 1.1 (il y a 85 jours)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Restaurant Le Gourmet', '75 Grande Allée E, Québec', 'mc-7003-problem', 'Problème de pression d''eau [TEST-DATA]', 'Terminé', 'Jean Dupuis', 'Remplacement filtre et nettoyage de la ligne d''eau', now() - interval '85 days')
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Filtre d''admission', 1, 65.00);

  -- Intervention 1.2 (il y a 60 jours)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Restaurant Le Gourmet', '75 Grande Allée E, Québec', 'mc-7003-problem', 'Fuite de liquide constatée [TEST-DATA]', 'Terminé', 'Marc Lavoie', 'Fuite d''huile détectée et remplacement joint d''étanchéité', now() - interval '60 days')
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Joint torique', 2, 45.00);

  -- Intervention 1.3 (il y a 20 jours)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Restaurant Le Gourmet', '75 Grande Allée E, Québec', 'mc-7003-problem', 'Nouvelle fuite sous le bac [TEST-DATA]', 'Terminé', 'Jean Dupuis', 'Nouvelle fuite de liquide, joint défectueux à remplacer', now() - interval '20 days')
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Joint torique', 2, 45.00); -- Pièce répétée !

  -- Intervention 1.4 (il y a 5 jours)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Restaurant Le Gourmet', '75 Grande Allée E, Québec', 'mc-7003-problem', 'Erreur de pression d''eau et blocage [TEST-DATA]', 'Terminé', 'Sophie Morin', 'Erreur de pression et blocage pompe, remplacement effectué', now() - interval '5 days')
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Pompe à eau', 1, 320.00);


  -- SCÉNARIO 2 : Machine mc-8002-monitor (À surveiller - Score de Risque modéré ~ 50)
  -- 2 interventions dans les 30 jours, mots-clés présents, pas de photo ni signature.
  
  -- Intervention 2.1 (il y a 25 jours)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Boulangerie Le Bon Pain', '120 Rue Saint-Jean, Québec', 'mc-8002-monitor', 'Problème de température élevée [TEST-DATA]', 'Terminé', 'Sophie Morin', 'Problème température élevée, calibration sonde effectuée', now() - interval '25 days')
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Sonde température', 1, 115.00);

  -- Intervention 2.2 (il y a 10 jours)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Boulangerie Le Bon Pain', '120 Rue Saint-Jean, Québec', 'mc-8002-monitor', 'Erreur blocage électrovanne [TEST-DATA]', 'Terminé', 'Antoine Bouchard', 'Erreur blocage electrovanne, nettoyage et test de cycle', now() - interval '10 days')
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Electrovanne', 1, 145.00);


  -- SCÉNARIO 3 : Machine mc-9001-stable (Stable - Score faible ~ 10)
  -- 1 seule intervention lointaine (80 jours), pas de mot-clé critique.
  
  -- Intervention 3.1 (il y a 80 jours)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Café des Arts', '45 Rue Garneau, Québec', 'mc-9001-stable', 'Remplacement filtre périodique [TEST-DATA]', 'Terminé', 'Antoine Bouchard', 'Entretien préventif standard et remplacement filtre d''admission', now() - interval '80 days')
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Filtre d''admission', 1, 65.00);


  -- SCÉNARIO 4 : Machine mc-6004-urgent (Intervention Urgente Aujourd'hui)
  -- 1 intervention créée aujourd'hui, statut "En attente" pour simuler une urgence sur le dashboard.
  
  -- Intervention 4.1 (Aujourd'hui)
  INSERT INTO public.service_calls (client_name, address, machine_serial, issue_description, status, technician_name, technician_notes, created_at)
  VALUES ('Usine Métal-Tech', '2200 Boulevard Wilfrid-Hamel, Québec', 'mc-6004-urgent', 'Erreur broyeur bloqué et fuite de liquide [TEST-DATA]', 'En attente', 'Jean Dupuis', NULL, now())
  RETURNING id INTO new_call_id;
  INSERT INTO public.service_call_parts (service_call_id, part_name, quantity, unit_price)
  VALUES (new_call_id, 'Moteur de rechange', 1, 480.00);


  -- =========================================================================
  -- INJECTION DES 42 AUTRES APPELS DE SERVICE DE FAÇON ALÉATOIRE
  -- =========================================================================
  
  FOR i IN 1..42 LOOP
    -- Sélection aléatoire des index
    rand_client_idx := 1 + floor(random() * array_length(clients, 1))::integer;
    rand_tech_idx := 1 + floor(random() * array_length(techs, 1))::integer;
    rand_serial_idx := 1 + floor(random() * array_length(serials, 1))::integer;
    rand_issue_idx := 1 + floor(random() * array_length(issues, 1))::integer;
    rand_notes_idx := 1 + floor(random() * array_length(notes_pool, 1))::integer;
    
    -- Répartition des statuts : 65% completed, 20% in progress, 15% pending
    IF random() < 0.15 THEN
      rand_status := 'En attente';
    ELSIF random() < 0.35 THEN
      rand_status := 'En cours';
    ELSE
      rand_status := 'Terminé';
    END IF;
    
    -- Répartition des dates : 5% aujourd'hui, 20% cette semaine, 40% 8-30 jours, 35% 31-90 jours
    IF random() < 0.05 THEN
      rand_date := now() - (random() * interval '12 hours');
    ELSIF random() < 0.25 THEN
      rand_date := now() - (random() * interval '6 days');
    ELSIF random() < 0.65 THEN
      rand_date := now() - (interval '7 days' + (random() * interval '23 days'));
    ELSE
      rand_date := now() - (interval '30 days' + (random() * interval '60 days'));
    END IF;
    
    -- Insertion de l'appel
    INSERT INTO public.service_calls (
      client_name,
      address,
      machine_serial,
      issue_description,
      status,
      technician_name,
      technician_notes,
      created_at
    ) VALUES (
      clients[rand_client_idx],
      addresses[rand_client_idx],
      serials[rand_serial_idx],
      issues[rand_issue_idx] || ' [TEST-DATA]',
      rand_status,
      techs[rand_tech_idx],
      CASE WHEN rand_status = 'Terminé' THEN notes_pool[rand_notes_idx] ELSE NULL END,
      rand_date
    ) RETURNING id INTO new_call_id;
    
    -- Insertion de la pièce associée
    INSERT INTO public.service_call_parts (
      service_call_id,
      part_name,
      quantity,
      unit_price
    ) VALUES (
      new_call_id,
      parts_pool[rand_notes_idx],
      1 + floor(random() * 2)::integer, -- Qté 1 ou 2
      prices_pool[rand_notes_idx]
    );
  END LOOP;
  
END $$;
