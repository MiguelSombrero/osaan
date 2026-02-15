package com.github.miguelsombrero.osaan.skill_catalog_service.api.controller;

import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.SkillDto;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping(value = "/v1/admin/skills")
@SecurityRequirement(name = "bearer")
@Tag(name = "AdminSkills", description = "REST API for admin operations on skills")
@ApiResponses(value = {
        @ApiResponse(responseCode = "400", description = "Bad Request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden"),
        @ApiResponse(responseCode = "404", description = "Not Found"),
        @ApiResponse(responseCode = "500", description = "Internal Server Error")
})
class AdminSkillController {

    private final SkillService service;

    public AdminSkillController(SkillService service) {
        this.service = service;
    }

    @PostMapping
    @ApiResponse(responseCode = "201", description = "Created")
    @Operation(summary = "Create Skill", description = "Creates new skill and returns created skill with generated ID.")
    public ResponseEntity<SkillDto> createSkill(@RequestBody SkillDto skill) {
        SkillDto saved = service.saveSkill(skill);
        URI location = URI.create("/v1/admin/skills/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    @DeleteMapping("/{skillId}")
    @ApiResponse(responseCode = "204", description = "No Content")
    @Operation(summary = "Delete skill", description = "Delete skill by ID")
    public ResponseEntity<SkillDto> deleteSkill(
            @Parameter(in = ParameterIn.PATH, required = true, example = "c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8")
            @PathVariable UUID skillId
    ) {
        service.deleteSkill(skillId);
        return ResponseEntity.noContent().build();
    }

}
