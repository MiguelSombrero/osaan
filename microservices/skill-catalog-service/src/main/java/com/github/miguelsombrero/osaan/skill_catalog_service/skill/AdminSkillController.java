package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
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

    @GetMapping
    @ApiResponse(responseCode = "200", description = "OK")
    @Operation(summary = "Get skills", description = "Get all skills.")
    public GetSkillsResponse getSkills(
            @Parameter(in = ParameterIn.QUERY,
                    description = "Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.",
                    array = @ArraySchema(schema = @Schema(type = "string", example = "name,asc")))
            @SortDefault(sort = "name") @Nullable Sort sort
    ) {
        return service.getSkills(sort);
    }

    @PostMapping
    @ApiResponse(responseCode = "201", description = "Created")
    @Operation(summary = "Create Skill", description = "Creates new skill and returns created skill with generated ID.")
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        Skill saved = service.saveSkill(skill);
        URI location = URI.create("/v1/admin/skills/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    @DeleteMapping("/{skillId}")
    @ApiResponse(responseCode = "204", description = "No Content")
    @Operation(summary = "Delete skill", description = "Delete skill by ID")
    public ResponseEntity<Skill> deleteSkill(
            @Parameter(in = ParameterIn.PATH, required = true, example = "c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8")
            @PathVariable UUID skillId
    ) {
        service.deleteSkill(skillId);
        return ResponseEntity.noContent().build();
    }

}
