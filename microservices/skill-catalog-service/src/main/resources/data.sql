INSERT INTO skills (id, name) VALUES
    ('a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5', 'java'),
    ('d7e1b2f4-8a33-46c1-9e42-3f9c71b85d2a', 'python'),
    ('c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8', 'javascript'),
    ('f9d5e1a7-61b4-42af-8f19-7c2a8e4d9b33', 'ux design'),
    ('b2e4c9d1-7f5a-4c6e-91d2-8a7f3e2b6c44', 'react'),
    ('e1f3a7b8-9c2d-4f6e-8b1a-5d3f7c2e4a9b', 'node.js'),
    ('a9b8c7d6-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 'sql'),
    ('d2c3b4a5-6e7f-8a9b-0c1d-2e3f4a5b6c7d', 'aws')
    ON CONFLICT (id) DO NOTHING;
