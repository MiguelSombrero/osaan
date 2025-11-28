package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;

@Service
class SkillService {

    private final SkillMapper mapper;
    private final SkillRepository repository;

    SkillService(SkillMapper mapper, SkillRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    public Skill saveSkill(Skill skill) {
        SkillEntity entity = mapper.apiToEntity(skill);
        return mapper.entityToApi(repository.save(entity));
    }

    public Skill getSkill(UUID skillId) {
        SkillEntity entity = repository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        return mapper.entityToApi(entity);
    }

    public Skill searchByName(String name) {
        SkillEntity entity = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        return mapper.entityToApi(entity);
    }

    public GetSkillsResponse getSkills(String query, Sort sort) {
        List<SkillEntity> entities;
        if (query != null && !query.isBlank()) {
            entities = repository.findByNameContainingIgnoreCase(query, sort);
        } else {
            entities = repository.findAll(sort);
        }
        return new GetSkillsResponse(entities.stream()
                .map(mapper::entityToApi).toList());
    }

    public void deleteSkill(UUID skillId) {
        repository.deleteById(skillId);
    }
}
