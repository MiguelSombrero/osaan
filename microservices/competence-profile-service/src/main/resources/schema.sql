CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS competences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID,
    skill_id UUID,
    rating INT CHECK (rating BETWEEN 1 AND 5)
);

CREATE UNIQUE INDEX IF NOT EXISTS competences_employee_skill_unique ON competences(employee_id, skill_id);
