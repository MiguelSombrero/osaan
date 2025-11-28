package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.ListPagingAndSortingRepository;

interface SkillRepository extends ListCrudRepository<SkillEntity, UUID>, ListPagingAndSortingRepository<SkillEntity, UUID> {
    Optional<SkillEntity> findByNameIgnoreCase(String name);

    List<SkillEntity> findByNameContainingIgnoreCase(String name, Sort sort);
}
