package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping(value = "/v1/admin/skills")
@Tag(name = "AdminSkills", description = "REST API for admin operations on skills")
class AdminSkillController {

    private final SkillService service;

    public AdminSkillController(SkillService service) {
        this.service = service;
    }

    @Operation(
            summary = "Create Skill",
            description = "Creates new skill and returns created skill with generated ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        Skill saved = service.saveSkill(skill);
        URI location = URI.create("/v1/admin/skills/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

}
