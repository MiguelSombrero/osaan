package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
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
    public Skill getSkill(
            @Parameter(in = ParameterIn.PATH, required = true, example = "c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8")
            @PathVariable UUID skillId
    ) {
        return service.getSkill(skillId);
    }

    @Operation(
            summary = "Search skill",
            description = "Search skill by name")
    @GetMapping
    public Skill searchSkillByName(
            @Parameter(in = ParameterIn.QUERY, required = true, example = "Java")
            @RequestParam String name
    ) {
        return service.searchByName(name);
    }

}
