package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/skills")
class SkillController {

    private final SkillService service;

    public SkillController(SkillService service) {
        this.service = service;
    }

    @PostMapping
    public Skill createSkill(@RequestBody Skill skill) {
        return service.saveSkill(skill);
    }

    @GetMapping("/{name}")
    public Skill getSkill(@PathVariable String name) {
        return service.getSkill(name);
    }

}
