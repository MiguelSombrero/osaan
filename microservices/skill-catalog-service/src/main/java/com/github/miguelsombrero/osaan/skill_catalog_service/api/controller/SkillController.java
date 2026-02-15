package com.github.miguelsombrero.osaan.skill_catalog_service.api.controller;

import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.GetSkillsResponse;
import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.SkillDto;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/v1/skills")
@SecurityRequirement(name = "bearer")
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

    @GetMapping
    @Operation(summary = "Get skills", description = "Get all skills with pagination support. Use 'page' (zero-based), 'size', and 'sort' query parameters.")
    public GetSkillsResponse getSkills(
            @Parameter(in = ParameterIn.QUERY,
                    description = "Filter skills by name (case-insensitive, partial match).",
                    schema = @Schema(type = "string", example = "java"))
            @RequestParam(required = false) String query,
            @ParameterObject @PageableDefault(size = 20, sort = "name")
            Pageable pageable
    ) {
        return service.getSkills(query, pageable);
    }

    @Operation(summary = "Get skill", description = "Get skill by ID")
    @GetMapping("/{skillId}")
    public SkillDto getSkill(
            @Parameter(in = ParameterIn.PATH, required = true, schema = @Schema(type = "string", example = "c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8"))
            @PathVariable UUID skillId
    ) {
        return service.getSkill(skillId);
    }

}
