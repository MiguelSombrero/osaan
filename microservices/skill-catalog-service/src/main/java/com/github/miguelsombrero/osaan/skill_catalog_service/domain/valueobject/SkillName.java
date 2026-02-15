package com.github.miguelsombrero.osaan.skill_catalog_service.domain.valueobject;

import java.util.Objects;

/**
 * Value object representing a validated and normalized skill name.
 * Enforces invariants: non-blank, max length, lowercase.
 */
public record SkillName(String value) {

    public static final int MAX_LENGTH = 255;

    public SkillName {
        validate(value);
    }

    public static SkillName of(String raw) {
        Objects.requireNonNull(raw, "Skill name must not be null");
        String normalized = raw.trim().toLowerCase();
        return new SkillName(normalized);
    }

    private static void validate(String value) {
        Objects.requireNonNull(value, "Skill name must not be null");
        if (value.isBlank()) {
            throw new IllegalArgumentException("Skill name must not be blank");
        }
        if (value.length() > MAX_LENGTH) {
            throw new IllegalArgumentException("Skill name must not exceed " + MAX_LENGTH + " characters");
        }
    }
}
