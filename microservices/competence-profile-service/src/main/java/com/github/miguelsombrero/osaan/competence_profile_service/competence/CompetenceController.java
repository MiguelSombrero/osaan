package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/competences")
class CompetenceController {

    private final CompetenceService service;

    public CompetenceController(CompetenceService service) {
        this.service = service;
    }

    @PostMapping
    public Competence createCompetence(@RequestBody Competence competence) {
        return service.saveCompetence(competence);
    }
}
