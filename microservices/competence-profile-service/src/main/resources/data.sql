-- 1) Anna Korhonen: Java
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('10101010-aaaa-bbbb-cccc-111111111111', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 3)
    ON CONFLICT (id) DO NOTHING;

-- 2) Mikko Virtanen: Python, JavaScript, UX Design
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('20202020-aaaa-bbbb-cccc-222222222222', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'd7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 2),
    ('20202020-aaaa-bbbb-cccc-333333333333', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 4),
    ('20202020-aaaa-bbbb-cccc-444444444444', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'f9d5e1a7-61b4-42af-8f19-7c2a8e4d9b33', 5)
    ON CONFLICT (id) DO NOTHING;

-- 3) Liisa Laine: Java, Python, JavaScript, UX Design, React
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('30303030-aaaa-bbbb-cccc-555555555555', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 1),
    ('30303030-aaaa-bbbb-cccc-666666666666', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'd7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 2),
    ('30303030-aaaa-bbbb-cccc-777777777777', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 3),
    ('30303030-aaaa-bbbb-cccc-888888888888', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'f9d5e1a7-61b4-42af-8f19-7c2a8e4d9b33', 4),
    ('30303030-aaaa-bbbb-cccc-999999999999', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'b2e4c9d1-7f5a-4c6e-91d2-8a7f3e2b6c44', 5)
    ON CONFLICT (id) DO NOTHING;
