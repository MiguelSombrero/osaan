package com.github.miguelsombrero.osaan.skill_catalog_service.domain.repository;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SkillRepository {
    Optional<Skill> findById(UUID id);

    Page<Skill> findAll(Pageable pageable);

    Skill save(Skill skill);

    Optional<Skill> findByNameIgnoreCase(String name);

    List<Skill> findByNameContainingIgnoreCase(String name, Pageable pageable);

    long countByNameContainingIgnoreCase(String name);

    void deleteById(UUID id);
}
