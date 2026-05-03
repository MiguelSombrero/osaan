-- 1) Anna Korhonen: Java, TypeScript, PostgreSQL, Docker, Agile, Communication, Leadership
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('10101010-aaaa-bbbb-cccc-111111111111', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 3),
    ('a1000001-0000-4000-8000-000000000001', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 4),
    ('a1000001-0000-4000-8000-000000000002', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', '5e6f7a8b-9c0d-1e2f-3a4b-6c7d8e9f0a1b', 3),
    ('a1000001-0000-4000-8000-000000000003', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', '1e2f3a4b-5c6d-7e8f-9a0b-2c3d4e5f6a7b', 2),
    ('a1000001-0000-4000-8000-000000000004', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 4),
    ('a1000001-0000-4000-8000-000000000005', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', '9c0d1e2f-3a4b-5c6d-7e8f-1a2b3c4d5e6f', 3),
    ('a1000001-0000-4000-8000-000000000006', 'f3c2aab1-5e72-4bfa-b6d2-9c1f5e8b32d1', '0d1e2f3a-4b5c-6d7e-8f9a-2b3c4d5e6f7a', 2)
    ON CONFLICT (id) DO NOTHING;

-- 2) Mikko Virtanen: Python, JavaScript, UX Design, React, TypeScript, CSS, HTML, Tailwind CSS, Communication, Mentoring
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('20202020-aaaa-bbbb-cccc-222222222222', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'd7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 2),
    ('20202020-aaaa-bbbb-cccc-333333333333', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 4),
    ('20202020-aaaa-bbbb-cccc-444444444444', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'f9d5e1a7-61b4-42af-8f19-7c2a8e4d9b33', 5),
    ('a2000002-0000-4000-8000-000000000001', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', 'b2e4c9d1-7f5a-4c6e-91d2-8a7f3e2b6c44', 4),
    ('a2000002-0000-4000-8000-000000000002', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 3),
    ('a2000002-0000-4000-8000-000000000003', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', 4),
    ('a2000002-0000-4000-8000-000000000004', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', 5),
    ('a2000002-0000-4000-8000-000000000005', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', 3),
    ('a2000002-0000-4000-8000-000000000006', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', '9c0d1e2f-3a4b-5c6d-7e8f-1a2b3c4d5e6f', 4),
    ('a2000002-0000-4000-8000-000000000007', '8a1b3f2d-6c9f-4db3-a13b-72f5c1e9a8d7', '6d7e8f9a-0b1c-2d3e-4f5a-8b9c0d1e2f3a', 3)
    ON CONFLICT (id) DO NOTHING;

-- 3) Liisa Laine: Java, Python, JavaScript, UX Design, React, TypeScript, CSS, HTML, Tailwind CSS, Jest, Cypress, Agile
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('30303030-aaaa-bbbb-cccc-555555555555', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 1),
    ('30303030-aaaa-bbbb-cccc-666666666666', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'd7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 2),
    ('30303030-aaaa-bbbb-cccc-777777777777', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 3),
    ('30303030-aaaa-bbbb-cccc-888888888888', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'f9d5e1a7-61b4-42af-8f19-7c2a8e4d9b33', 4),
    ('30303030-aaaa-bbbb-cccc-999999999999', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', 'b2e4c9d1-7f5a-4c6e-91d2-8a7f3e2b6c44', 5),
    ('a3000003-0000-4000-8000-000000000001', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 4),
    ('a3000003-0000-4000-8000-000000000002', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', 5),
    ('a3000003-0000-4000-8000-000000000003', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', 4),
    ('a3000003-0000-4000-8000-000000000004', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', 4),
    ('a3000003-0000-4000-8000-000000000005', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', '5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d', 3),
    ('a3000003-0000-4000-8000-000000000006', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', '7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f', 3),
    ('a3000003-0000-4000-8000-000000000007', '7c0e21b4-9f2a-47a6-bf11-1dbe5a8472f9', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 4)
    ON CONFLICT (id) DO NOTHING;

-- 4) Jari Mäkinen: Java, Python, SQL, PostgreSQL, Redis, Docker, Kubernetes, Agile, Scrum, TDD, Code Review, Problem Solving
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('a4000004-0000-4000-8000-000000000001', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 4),
    ('a4000004-0000-4000-8000-000000000002', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', 'd7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 3),
    ('a4000004-0000-4000-8000-000000000003', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', 'a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 4),
    ('a4000004-0000-4000-8000-000000000004', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '5e6f7a8b-9c0d-1e2f-3a4b-6c7d8e9f0a1b', 5),
    ('a4000004-0000-4000-8000-000000000005', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '3c4d5e6f-7a8b-9c0d-1e2f-4a5b6c7d8e9f', 3),
    ('a4000004-0000-4000-8000-000000000006', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '1e2f3a4b-5c6d-7e8f-9a0b-2c3d4e5f6a7b', 4),
    ('a4000004-0000-4000-8000-000000000007', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '2f3a4b5c-6d7e-8f9a-0b1c-3d4e5f6a7b8c', 3),
    ('a4000004-0000-4000-8000-000000000008', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 5),
    ('a4000004-0000-4000-8000-000000000009', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '9e0f1a2b-3c4d-5e6f-7a8b-0c1d2e3f4a5b', 4),
    ('a4000004-0000-4000-8000-00000000000a', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '5e6f7a8b-9c0d-1e2f-3a4b-7c8d9e0f1a2b', 3),
    ('a4000004-0000-4000-8000-00000000000b', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '8b9c0d1e-2f3a-4b5c-6d7e-0f1a2b3c4d5e', 4),
    ('a4000004-0000-4000-8000-00000000000c', 'b52f3c8d-43af-4e6e-8dfc-6a3c2f19c8a4', '1e2f3a4b-5c6d-7e8f-9a0b-3c4d5e6f7a8b', 5)
    ON CONFLICT (id) DO NOTHING;

-- 5) Sari Niemi: Python, R, SQL, PostgreSQL, Elasticsearch, Docker, Agile, Communication, Leadership, Critical Thinking, Problem Solving, Adaptability
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('a5000005-0000-4000-8000-000000000001', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', 'd7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 4),
    ('a5000005-0000-4000-8000-000000000002', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 3),
    ('a5000005-0000-4000-8000-000000000003', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', 'a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 5),
    ('a5000005-0000-4000-8000-000000000004', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '5e6f7a8b-9c0d-1e2f-3a4b-6c7d8e9f0a1b', 4),
    ('a5000005-0000-4000-8000-000000000005', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '7a8b9c0d-1e2f-3a4b-5c6d-8e9f0a1b2c3d', 3),
    ('a5000005-0000-4000-8000-000000000006', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '1e2f3a4b-5c6d-7e8f-9a0b-2c3d4e5f6a7b', 2),
    ('a5000005-0000-4000-8000-000000000007', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 3),
    ('a5000005-0000-4000-8000-000000000008', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '9c0d1e2f-3a4b-5c6d-7e8f-1a2b3c4d5e6f', 4),
    ('a5000005-0000-4000-8000-000000000009', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '0d1e2f3a-4b5c-6d7e-8f9a-2b3c4d5e6f7a', 3),
    ('a5000005-0000-4000-8000-00000000000a', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '4b5c6d7e-8f9a-0b1c-2d3e-6f7a8b9c0d1e', 5),
    ('a5000005-0000-4000-8000-00000000000b', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '1e2f3a4b-5c6d-7e8f-9a0b-3c4d5e6f7a8b', 4),
    ('a5000005-0000-4000-8000-00000000000c', 'd8f1a6c4-75e2-49b7-a3f1-8e7c2d49f3b2', '5c6d7e8f-9a0b-1c2d-3e4f-7a8b9c0d1e2f', 3)
    ON CONFLICT (id) DO NOTHING;

-- 6) Aleksi Järvinen: Java, JavaScript, TypeScript, React, Node.js, SQL, PostgreSQL, Docker, Kubernetes, GitHub Actions, Agile, TDD, Code Review, Teamwork, Problem Solving
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('a6000006-0000-4000-8000-000000000001', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 5),
    ('a6000006-0000-4000-8000-000000000002', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', 'c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 4),
    ('a6000006-0000-4000-8000-000000000003', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 5),
    ('a6000006-0000-4000-8000-000000000004', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', 'b2e4c9d1-7f5a-4c6e-91d2-8a7f3e2b6c44', 4),
    ('a6000006-0000-4000-8000-000000000005', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', 'e1f3a7b8-9c2d-4f6e-8b1a-5d3f7c2e4a9b', 3),
    ('a6000006-0000-4000-8000-000000000006', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', 'a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 4),
    ('a6000006-0000-4000-8000-000000000007', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '5e6f7a8b-9c0d-1e2f-3a4b-6c7d8e9f0a1b', 3),
    ('a6000006-0000-4000-8000-000000000008', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '1e2f3a4b-5c6d-7e8f-9a0b-2c3d4e5f6a7b', 5),
    ('a6000006-0000-4000-8000-000000000009', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '2f3a4b5c-6d7e-8f9a-0b1c-3d4e5f6a7b8c', 4),
    ('a6000006-0000-4000-8000-00000000000a', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '7e8f9a0b-1c2d-3e4f-5a6b-8c9d0e1f2a3b', 4),
    ('a6000006-0000-4000-8000-00000000000b', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 4),
    ('a6000006-0000-4000-8000-00000000000c', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '5e6f7a8b-9c0d-1e2f-3a4b-7c8d9e0f1a2b', 4),
    ('a6000006-0000-4000-8000-00000000000d', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '8b9c0d1e-2f3a-4b5c-6d7e-0f1a2b3c4d5e', 3),
    ('a6000006-0000-4000-8000-00000000000e', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '2f3a4b5c-6d7e-8f9a-0b1c-4d5e6f7a8b9c', 4),
    ('a6000006-0000-4000-8000-00000000000f', 'e1a2b3c4-d5e6-47f8-a9b0-c1d2e3f4a5b6', '1e2f3a4b-5c6d-7e8f-9a0b-3c4d5e6f7a8b', 4)
    ON CONFLICT (id) DO NOTHING;

-- 7) Kaisa Hautamäki: JavaScript, TypeScript, React, Vue.js, CSS, HTML, Sass, Tailwind CSS, Jest, Cypress, Webpack, Vite, UX Design, Agile, Communication
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('a7000007-0000-4000-8000-000000000001', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', 'c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 5),
    ('a7000007-0000-4000-8000-000000000002', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 4),
    ('a7000007-0000-4000-8000-000000000003', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', 'b2e4c9d1-7f5a-4c6e-91d2-8a7f3e2b6c44', 5),
    ('a7000007-0000-4000-8000-000000000004', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d', 3),
    ('a7000007-0000-4000-8000-000000000005', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b', 5),
    ('a7000007-0000-4000-8000-000000000006', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f1a', 5),
    ('a7000007-0000-4000-8000-000000000007', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', 4),
    ('a7000007-0000-4000-8000-000000000008', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d', 4),
    ('a7000007-0000-4000-8000-000000000009', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d', 4),
    ('a7000007-0000-4000-8000-00000000000a', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f', 3),
    ('a7000007-0000-4000-8000-00000000000b', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e', 3),
    ('a7000007-0000-4000-8000-00000000000c', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', 4),
    ('a7000007-0000-4000-8000-00000000000d', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', 'f9d5e1a7-61b4-42af-8f19-7c2a8e4d9b33', 4),
    ('a7000007-0000-4000-8000-00000000000e', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 3),
    ('a7000007-0000-4000-8000-00000000000f', 'f2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b6c7', '9c0d1e2f-3a4b-5c6d-7e8f-1a2b3c4d5e6f', 5)
    ON CONFLICT (id) DO NOTHING;

-- 8) Timo Heikkinen: Java, Docker, Kubernetes, Helm, Terraform, Ansible, Jenkins, GitLab CI, GitHub Actions, ArgoCD, Prometheus, Grafana, AWS, Azure, Agile
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('a8000008-0000-4000-8000-000000000001', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 2),
    ('a8000008-0000-4000-8000-000000000002', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '1e2f3a4b-5c6d-7e8f-9a0b-2c3d4e5f6a7b', 5),
    ('a8000008-0000-4000-8000-000000000003', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '2f3a4b5c-6d7e-8f9a-0b1c-3d4e5f6a7b8c', 5),
    ('a8000008-0000-4000-8000-000000000004', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '9a0b1c2d-3e4f-5a6b-7c8d-0e1f2a3b4c5d', 4),
    ('a8000008-0000-4000-8000-000000000005', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '3a4b5c6d-7e8f-9a0b-1c2d-4e5f6a7b8c9d', 4),
    ('a8000008-0000-4000-8000-000000000006', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '4b5c6d7e-8f9a-0b1c-2d3e-5f6a7b8c9d0e', 3),
    ('a8000008-0000-4000-8000-000000000007', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '5c6d7e8f-9a0b-1c2d-3e4f-6a7b8c9d0e1f', 4),
    ('a8000008-0000-4000-8000-000000000008', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '6d7e8f9a-0b1c-2d3e-4f5a-7b8c9d0e1f2a', 5),
    ('a8000008-0000-4000-8000-000000000009', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '7e8f9a0b-1c2d-3e4f-5a6b-8c9d0e1f2a3b', 4),
    ('a8000008-0000-4000-8000-00000000000a', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '8f9a0b1c-2d3e-4f5a-6b7c-9d0e1f2a3b4c', 4),
    ('a8000008-0000-4000-8000-00000000000b', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '1c2d3e4f-5a6b-7c8d-9e0f-2a3b4c5d6e7f', 4),
    ('a8000008-0000-4000-8000-00000000000c', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '2d3e4f5a-6b7c-8d9e-0f1a-3b4c5d6e7f8a', 4),
    ('a8000008-0000-4000-8000-00000000000d', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', 'd2c3b4a5-6e7f-8a9b-0c1d-2e3f4a5b6c7d', 4),
    ('a8000008-0000-4000-8000-00000000000e', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '4f5a6b7c-8d9e-0f1a-2b3c-5d6e7f8a9b0c', 3),
    ('a8000008-0000-4000-8000-00000000000f', 'a3c4d5e6-f7a8-49b0-c1d2-e3f4a5b6c7d8', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 3)
    ON CONFLICT (id) DO NOTHING;

-- 9) Emilia Salonen: Java, Kotlin, SQL, PostgreSQL, Redis, Kafka, RabbitMQ, Docker, Agile, Scrum, TDD, JUnit, Mockito, Problem Solving, Communication
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('a9000009-0000-4000-8000-000000000001', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 5),
    ('a9000009-0000-4000-8000-000000000002', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 4),
    ('a9000009-0000-4000-8000-000000000003', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', 'a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 4),
    ('a9000009-0000-4000-8000-000000000004', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '5e6f7a8b-9c0d-1e2f-3a4b-6c7d8e9f0a1b', 4),
    ('a9000009-0000-4000-8000-000000000005', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '3c4d5e6f-7a8b-9c0d-1e2f-4a5b6c7d8e9f', 3),
    ('a9000009-0000-4000-8000-000000000006', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '8b9c0d1e-2f3a-4b5c-6d7e-9f0a1b2c3d4e', 4),
    ('a9000009-0000-4000-8000-000000000007', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '9c0d1e2f-3a4b-5c6d-7e8f-0a1b2c3d4e5f', 3),
    ('a9000009-0000-4000-8000-000000000008', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '1e2f3a4b-5c6d-7e8f-9a0b-2c3d4e5f6a7b', 4),
    ('a9000009-0000-4000-8000-000000000009', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 4),
    ('a9000009-0000-4000-8000-00000000000a', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '9e0f1a2b-3c4d-5e6f-7a8b-0c1d2e3f4a5b', 4),
    ('a9000009-0000-4000-8000-00000000000b', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '5e6f7a8b-9c0d-1e2f-3a4b-7c8d9e0f1a2b', 5),
    ('a9000009-0000-4000-8000-00000000000c', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a', 5),
    ('a9000009-0000-4000-8000-00000000000d', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '2b3c4d5e-6f7a-8b9c-0d1e-3f4a5b6c7d8e', 4),
    ('a9000009-0000-4000-8000-00000000000e', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '1e2f3a4b-5c6d-7e8f-9a0b-3c4d5e6f7a8b', 5),
    ('a9000009-0000-4000-8000-00000000000f', 'b4d5e6f7-a8b9-40c1-d2e3-f4a5b6c7d8e9', '9c0d1e2f-3a4b-5c6d-7e8f-1a2b3c4d5e6f', 3)
    ON CONFLICT (id) DO NOTHING;

-- 10) Petri Leinonen: Java, JavaScript, Python, TypeScript, SQL, Docker, Kubernetes, AWS, Agile, Scrum, Leadership, Mentoring, Code Review, Pair Programming, Critical Thinking
INSERT INTO competences (id, employee_id, skill_id, rating) VALUES
    ('aa000010-0000-4000-8000-000000000001', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', 'a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 4),
    ('aa000010-0000-4000-8000-000000000002', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', 'c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 3),
    ('aa000010-0000-4000-8000-000000000003', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', 'd7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 2),
    ('aa000010-0000-4000-8000-000000000004', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 3),
    ('aa000010-0000-4000-8000-000000000005', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', 'a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 4),
    ('aa000010-0000-4000-8000-000000000006', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '1e2f3a4b-5c6d-7e8f-9a0b-2c3d4e5f6a7b', 4),
    ('aa000010-0000-4000-8000-000000000007', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '2f3a4b5c-6d7e-8f9a-0b1c-3d4e5f6a7b8c', 3),
    ('aa000010-0000-4000-8000-000000000008', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', 'd2c3b4a5-6e7f-8a9b-0c1d-2e3f4a5b6c7d', 4),
    ('aa000010-0000-4000-8000-000000000009', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '8d9e0f1a-2b3c-4d5e-6f7a-9b0c1d2e3f4a', 5),
    ('aa000010-0000-4000-8000-00000000000a', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '9e0f1a2b-3c4d-5e6f-7a8b-0c1d2e3f4a5b', 5),
    ('aa000010-0000-4000-8000-00000000000b', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '0d1e2f3a-4b5c-6d7e-8f9a-2b3c4d5e6f7a', 5),
    ('aa000010-0000-4000-8000-00000000000c', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '6d7e8f9a-0b1c-2d3e-4f5a-8b9c0d1e2f3a', 5),
    ('aa000010-0000-4000-8000-00000000000d', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '8b9c0d1e-2f3a-4b5c-6d7e-0f1a2b3c4d5e', 5),
    ('aa000010-0000-4000-8000-00000000000e', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '7a8b9c0d-1e2f-3a4b-5c6d-9e0f1a2b3c4d', 4),
    ('aa000010-0000-4000-8000-00000000000f', 'c5e6f7a8-b9c0-41d2-e3f4-a5b6c7d8e9f0', '4b5c6d7e-8f9a-0b1c-2d3e-6f7a8b9c0d1e', 4)
    ON CONFLICT (id) DO NOTHING;
