package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/v1/skills")
class SkillController {

    private final SkillService service;

    public SkillController(SkillService service) {
        this.service = service;
    }

    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return service.saveSkill(skill);
    }

    @GetMapping("/{skillId}")
    public Skill getSkill(@PathVariable UUID skillId) {
        return service.getSkill(skillId);
    }

    @GetMapping
    public Skill searchSkillByName(@RequestParam String name) {
        return service.searchByName(name);
    }

}
