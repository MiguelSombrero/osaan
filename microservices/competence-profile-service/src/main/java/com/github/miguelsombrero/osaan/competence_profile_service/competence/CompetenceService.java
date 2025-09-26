package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.integration.CompetenceIntegration;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Skill;
import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
class CompetenceService {

    private final CompetenceMapper mapper;
    private final CompetenceRepository repository;
    private final CompetenceIntegration integration;

    CompetenceService(
            CompetenceMapper mapper, CompetenceRepository repository, CompetenceIntegration integration
    ) {
        this.mapper = mapper;
        this.repository = repository;
        this.integration = integration;
    }

    public List<Competence> saveCompetences(List<Competence> competences) {
        if (integration.getEmployee(competences.getFirst().getEmployeeId()).isEmpty()) {
            log.error("Employee with id {} does not exist", competences.getFirst().getEmployeeId());
            throw new ResourceNotFoundException("Employee not found");
        }

        //TODO: Validate skills exist

        List<CompetenceEntity> entities = competences.stream()
                .map(mapper::apiToEntity)
                .toList();

        return repository.saveAll(entities).stream()
                .map(mapper::entityToApi)
                .toList();
    }

    public List<Employee> searchBySkillAndRating(String skillName, Optional<Integer> minRating) {
        Skill skill = integration.findSkillByName(skillName);

        List<Competence> profiles = minRating
                .map(rating -> repository.findBySkillIdAndRatingGreaterThanEqual(skill.getId(), rating))
                .orElseGet(() -> repository.findBySkillId(skill.getId()));

        return profiles.stream()
                .map(cp -> integration.getEmployee(cp.getEmployeeId()))
                .flatMap(Optional::stream)
                .toList();
    }
}
