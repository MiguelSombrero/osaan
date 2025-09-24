CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS competences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID,
    skill_id UUID,
    rating INT CHECK (rating BETWEEN 1 AND 5)
);
