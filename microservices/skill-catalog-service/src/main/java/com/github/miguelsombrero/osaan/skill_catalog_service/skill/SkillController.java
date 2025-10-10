package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/v1/skills")
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "400", description = "Bad Request"),
        @ApiResponse(responseCode = "404", description = "Not Found"),
        @ApiResponse(responseCode = "500", description = "Internal Server Error")
})
@Tag(name = "PublicSkills", description = "REST API for public operations on skills")
class SkillController {

    private final SkillService service;

    public SkillController(SkillService service) {
        this.service = service;
    }

    @Operation(
            summary = "Get skill",
            description = "Get skill by ID")
    @GetMapping("/{skillId}")
    public Skill getSkill(@PathVariable UUID skillId) {
        return service.getSkill(skillId);
    }

    @Operation(
            summary = "Search skill",
            description = "Search skill by name")
    @GetMapping
    public Skill searchSkillByName(@RequestParam String name) {
        return service.searchByName(name);
    }

}
