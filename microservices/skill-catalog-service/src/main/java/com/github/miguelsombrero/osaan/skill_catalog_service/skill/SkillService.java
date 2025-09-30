package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

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

}
