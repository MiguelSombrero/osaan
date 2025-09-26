package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/competences")
class CompetenceController {

    private final CompetenceService service;

    public CompetenceController(CompetenceService service) {
        this.service = service;
    }

    @PostMapping
    public List<Competence> createCompetences(@RequestBody List<Competence> competences) {
        return service.saveCompetences(competences);
    }

    @GetMapping("/search")
    public List<Employee> search(
            @RequestParam String skill,
            @RequestParam(required = false) Integer rating) {
        return service.searchBySkillAndRating(skill, Optional.ofNullable(rating));
    }
}
