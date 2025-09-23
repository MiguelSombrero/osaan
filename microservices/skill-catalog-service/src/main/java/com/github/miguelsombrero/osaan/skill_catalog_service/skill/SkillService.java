package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import org.springframework.stereotype.Service;

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

    public Skill getSkill(String name) {
        SkillEntity entity = repository.findByNameIgnoreCase(name).orElse(new SkillEntity());
        return mapper.entityToApi(entity);
    }
}
