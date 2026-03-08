package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/v1/competences")
@SecurityRequirement(name = "bearer")
@Tag(name = "Competences", description = "REST API for operations on competences")
@ApiResponses(value = {
        @ApiResponse(responseCode = "400", description = "Bad Request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden"),
        @ApiResponse(responseCode = "404", description = "Not Found"),
        @ApiResponse(responseCode = "500", description = "Internal Server Error")
})
class CompetenceController {

    private final CompetenceService service;

    public CompetenceController(CompetenceService service) {
        this.service = service;
    }

    @PostMapping("/{employeeId}")
    @ApiResponse(responseCode = "201", description = "Created")
    @Operation(summary = "Create Competences", description = "Creates new competences for an employee")
    public List<Competence> createCompetences(
            @Parameter(in = ParameterIn.PATH, required = true, example = "c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8")
            @PathVariable UUID employeeId,
            @RequestBody List<Competence> competences) {
        //TODO: EmployeeId should be extracted from OAuth2 token
        return service.saveCompetences(employeeId, competences);
    }

    @GetMapping("/search")
    @ApiResponse(responseCode = "200", description = "OK")
    @Operation(summary = "Search Competences", description = "Searches for employees having competences by skill and rating")
    public List<Employee> search(
            @Parameter(in = ParameterIn.QUERY, schema = @Schema(type = "string", example = "java",
                    description = "Skill name to search for (case-insensitive, partial match)."))
            @RequestParam(required = false) String skill,
            @Parameter(in = ParameterIn.QUERY, schema = @Schema(type = "number", example = "3",
                    description = "Minimum rating to filter competences (inclusive)."))
            @RequestParam(required = false) Integer rating) {
        return service.searchBySkillAndRating(skill, Optional.ofNullable(rating));
    }
}
