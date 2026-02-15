package com.github.miguelsombrero.osaan.skill_catalog_service.domain.service;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.GetSkillsResponse;
import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.SkillDto;
import com.github.miguelsombrero.osaan.skill_catalog_service.api.mapper.ApiDomainSkillMapper;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.repository.SkillRepository;
import com.github.miguelsombrero.osaan.skill_catalog_service.skill.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SkillService {

    private final ApiDomainSkillMapper mapper;
    private final SkillRepository repository;

    SkillService(ApiDomainSkillMapper mapper, SkillRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    public SkillDto saveSkill(SkillDto skill) {
        Skill domain = mapper.apiToDomain(skill);
        return mapper.domainToApi(repository.save(domain));
    }

    public SkillDto getSkill(UUID skillId) {
        Skill domain = repository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        return mapper.domainToApi(domain);
    }

    public SkillDto searchByName(String name) {
        Skill domain = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        return mapper.domainToApi(domain);
    }

    /**
     * Using custom count query when filtering with pageable, because Spring Data JDBC does not support it out of the box.
     * Without it Spring creates COUNT query including ORDER BY clause which causes syntax error in some databases.
     */
    public GetSkillsResponse getSkills(String query, Pageable pageable) {
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

        Page<Skill> page = new PageImpl<>(content, pageable, total);

        List<SkillDto> skills = page.getContent().stream()
                .map(mapper::domainToApi)
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
