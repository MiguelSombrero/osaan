package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
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

    /**
     * Using custom count query when filtering with pageable, because Spring Data JDBC does not support it out of the box.
     * Without it Spring creates COUNT query including ORDER BY clause which causes syntax error in some databases.
     */
    public GetSkillsResponse getSkills(String query, Pageable pageable) {
        List<SkillEntity> content;
        long total;

        if (query != null && !query.isBlank()) {
            content = repository.findByNameContainingIgnoreCase(query, pageable);
            total = repository.countByNameContainingIgnoreCase(query);
        } else {
            Page<SkillEntity> page = repository.findAll(pageable);
            content = page.getContent();
            total = page.getTotalElements();
        }

        Page<SkillEntity> page = new PageImpl<>(content, pageable, total);

        List<Skill> skills = page.getContent().stream()
                .map(mapper::entityToApi)
                .toList();

        return new GetSkillsResponse(
                skills,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }

    public void deleteSkill(UUID skillId) {
        repository.deleteById(skillId);
    }
}
