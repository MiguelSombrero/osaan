package com.github.miguelsombrero.osaan.skill_catalog_service.application.service;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import com.github.miguelsombrero.osaan.skill_catalog_service.application.port.ManageSkillsPort;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.repository.SkillRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ManageSkillsService implements ManageSkillsPort {

    private final SkillRepository repository;

    public ManageSkillsService(SkillRepository repository) {
        this.repository = repository;
    }

    @Override
    public Skill createSkill(String name) {
        Skill skill = Skill.create(name);
        return repository.save(skill);
    }

    @Override
    public Skill getSkill(UUID skillId) {
        return repository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
    }

    @Override
    public Skill getSkillByName(String name) {
        return repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
    }
    
    /**
     * Using custom count query when filtering with pageable, because Spring Data JDBC does not support it out of the box.
     * Without it Spring creates COUNT query including ORDER BY clause which causes syntax error in some databases.
     */
    @Override
    public Page<Skill> getSkills(String query, Pageable pageable) {
        List<Skill> content;
        long total;

        if (query != null && !query.isBlank()) {
            content = repository.findByNameContainingIgnoreCase(query, pageable);
            total = repository.countByNameContainingIgnoreCase(query);
        } else {
            Page<Skill> page = repository.findAll(pageable);
            content = page.getContent();
            total = page.getTotalElements();
        }

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public void deleteSkill(UUID skillId) {
        repository.deleteById(skillId);
    }
}
