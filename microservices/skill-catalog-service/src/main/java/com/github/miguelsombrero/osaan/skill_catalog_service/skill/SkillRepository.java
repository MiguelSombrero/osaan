package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import org.springframework.data.repository.ListCrudRepository;

import java.util.Optional;
import java.util.UUID;

interface SkillRepository extends ListCrudRepository<SkillEntity, UUID> {
    Optional<SkillEntity> findByNameIgnoreCase(String name);
}
