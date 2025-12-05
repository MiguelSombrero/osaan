package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface SkillRepository extends ListCrudRepository<SkillEntity, UUID>, PagingAndSortingRepository<SkillEntity, UUID> {
    Optional<SkillEntity> findByNameIgnoreCase(String name);

    List<SkillEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);

    long countByNameContainingIgnoreCase(String name);
}
