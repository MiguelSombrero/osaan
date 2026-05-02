package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import com.github.miguelsombrero.osaan.core.security.AuthenticatedUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiResponse(responseCode = "201", description = "Created")
    @Operation(summary = "Create Competences", description = "Creates new competences for the authenticated user")
    public List<Competence> createCompetences(
            AuthenticatedUser user,
            @RequestBody List<Competence> competences) {
        return service.saveCompetences(user, competences);
    }

    @GetMapping
    @ApiResponse(responseCode = "200", description = "OK")
    @Operation(summary = "Get Competence Profile", description = "Returns the authenticated user's competence profile")
    public CompetenceProfile getProfile(AuthenticatedUser user) {
        return service.getProfile(user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @ApiResponse(responseCode = "204", description = "No Content")
    @Operation(summary = "Delete Competence", description = "Deletes a competence from the authenticated user's profile")
    public void deleteCompetence(AuthenticatedUser user, @PathVariable UUID id) {
        service.deleteCompetence(user, id);
    }

    @PatchMapping("/{id}")
    @ApiResponse(responseCode = "200", description = "OK")
    @Operation(summary = "Update Competence Rating", description = "Updates the rating of a competence in the authenticated user's profile")
    public Competence updateCompetenceRating(
            AuthenticatedUser user,
            @PathVariable UUID id,
            @RequestBody UpdateRatingRequest request) {
        return service.updateCompetenceRating(user, id, request.rating());
    }

    private record UpdateRatingRequest(int rating) {}

    @GetMapping("/search")
    @ApiResponse(responseCode = "200", description = "OK")
    @Operation(summary = "Search Competences", description = "Searches for employees having competences by skill and rating")
    public List<Employee> search(
            @Parameter(in = ParameterIn.QUERY, schema = @Schema(type = "string", example = "java",
                    description = "Skill name to search for (case-insensitive, partial match)."))
            @RequestParam(required = false) String skillName,
            @Parameter(in = ParameterIn.QUERY, schema = @Schema(type = "number", example = "3",
                    description = "Minimum rating to filter competences (inclusive)."))
            @RequestParam(required = false) Integer rating) {
        return service.searchBySkillAndRating(skillName, Optional.ofNullable(rating));
    }
}
