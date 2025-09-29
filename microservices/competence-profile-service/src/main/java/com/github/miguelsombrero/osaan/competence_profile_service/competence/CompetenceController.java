package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(value = "/competences", version = "1")
class CompetenceController {

    private final CompetenceService service;

    public CompetenceController(CompetenceService service) {
        this.service = service;
    }

    @PostMapping("/{employeeId}")
    public List<Competence> createCompetences(
            @PathVariable UUID employeeId, @RequestBody List<Competence> competences) {
        //TODO: EmployeeId should be extracted from OAuth2 token
        return service.saveCompetences(employeeId, competences);
    }

    @GetMapping("/search")
    public List<Employee> search(
            @RequestParam String skill,
            @RequestParam(required = false) Integer rating) {
        return service.searchBySkillAndRating(skill, Optional.ofNullable(rating));
    }
}
