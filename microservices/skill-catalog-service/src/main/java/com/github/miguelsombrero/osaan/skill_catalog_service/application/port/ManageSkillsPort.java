package com.github.miguelsombrero.osaan.skill_catalog_service.application.port;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ManageSkillsPort {

    Skill createSkill(String name);

    Skill getSkill(UUID skillId);

    Skill getSkillByName(String name);

    Page<Skill> getSkills(String query, Pageable pageable);

    void deleteSkill(UUID skillId);
}
