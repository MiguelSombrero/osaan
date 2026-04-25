INSERT INTO employees (id, first_name, last_name, email, keycloak_id) VALUES
    ('f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', 'Anna', 'Korhonen', 'anna.korhonen@example.com', 'a1b2c3d4-0001-4000-a000-000000000001'),
    ('8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'Mikko', 'Virtanen', 'mikko.virtanen@example.com', 'a1b2c3d4-0002-4000-a000-000000000002'),
    ('7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'Liisa', 'Laine', 'liisa.laine@example.com', 'a1b2c3d4-0003-4000-a000-000000000003'),
    ('b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', 'Jari', 'Mäkinen', 'jari.makinen@example.com', 'a1b2c3d4-0004-4000-a000-000000000004'),
    ('d8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', 'Sari', 'Niemi', 'sari.niemi@example.com', 'a1b2c3d4-0005-4000-a000-000000000005')
    ON CONFLICT (id) DO UPDATE SET keycloak_id = EXCLUDED.keycloak_id;