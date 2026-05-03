INSERT INTO employees (id, first_name, last_name, email, keycloak_id) VALUES
    ('f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', 'Anna', 'Korhonen', 'anna.korhonen@example.com', 'a1b2c3d4-0001-4000-a000-000000000001'),
    ('8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'Mikko', 'Virtanen', 'mikko.virtanen@example.com', 'a1b2c3d4-0002-4000-a000-000000000002'),
    ('7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'Liisa', 'Laine', 'liisa.laine@example.com', 'a1b2c3d4-0003-4000-a000-000000000003'),
    ('b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', 'Jari', 'Mäkinen', 'jari.makinen@example.com', 'a1b2c3d4-0004-4000-a000-000000000004'),
    ('d8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', 'Sari', 'Niemi', 'sari.niemi@example.com', 'a1b2c3d4-0005-4000-a000-000000000005'),
    ('e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', 'Aleksi', 'Järvinen', 'aleksi.jarvinen@example.com', 'a1b2c3d4-0006-4000-a000-000000000006'),
    ('f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', 'Kaisa', 'Hautamäki', 'kaisa.hautamaki@example.com', 'a1b2c3d4-0007-4000-a000-000000000007'),
    ('a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', 'Timo', 'Heikkinen', 'timo.heikkinen@example.com', 'a1b2c3d4-0008-4000-a000-000000000008'),
    ('b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', 'Emilia', 'Salonen', 'emilia.salonen@example.com', 'a1b2c3d4-0009-4000-a000-000000000009'),
    ('c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', 'Petri', 'Leinonen', 'petri.leinonen@example.com', 'a1b2c3d4-0010-4000-a000-000000000010')
    ON CONFLICT (id) DO UPDATE SET keycloak_id = EXCLUDED.keycloak_id;