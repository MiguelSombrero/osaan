package com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.valueobject.SkillName;

import java.util.UUID;

/**
 * Domain entity representing a skill in the catalog.
 * Use {@link #create(String)} for creating new skills.
 * When loading from persistence, use the record constructor directly; the name is assumed to already be normalized.
 */
public record Skill(UUID id, String name) {

    /**
     * Factory for creating a new skill. Validates and normalizes the name.
     *
     * @param name the raw skill name (will be trimmed and lowercased)
     * @return new Skill with id=null, ready for persistence
     */
    public static Skill create(String name) {
        SkillName skillName = SkillName.of(name);
        return new Skill(null, skillName.value());
    }
}
