package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.config.SkillEventProducerConfig;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.CompetenceIntegration;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Skill;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
class CompetenceService {

    private final CompetenceMapper mapper;
    private final CompetenceRepository repository;
    private final CompetenceIntegration integration;
    private final SkillEventProducerConfig producer;

    CompetenceService(
            CompetenceMapper mapper,
            CompetenceRepository repository,
            CompetenceIntegration integration,
            SkillEventProducerConfig producer
    ) {
        this.mapper = mapper;
        this.repository = repository;
        this.integration = integration;
        this.producer = producer;
    }

    public List<Competence> saveCompetences(UUID employeeId, List<Competence> competences) {
        if (integration.getEmployee(employeeId).isEmpty()) {
            log.error("Employee with id {} does not exist", employeeId);
            throw new ResourceNotFoundException("Employee not found");
        }

        List<Skill> skills = competences.stream()
                .map(c -> integration.findSkillById(c.getSkillId()))
                .toList();

        List<CompetenceEntity> entities = competences.stream()
                .map(c -> mapper.apiToEntity(c, employeeId))
                .toList();

        List<Competence> savedCompetences = repository.saveAll(entities).stream()
                .map(mapper::entityToApi)
                .toList();

        savedCompetences.stream().forEach(c -> {
            String skillName = skills.stream()
                    .filter(s -> s.getId().equals(c.getSkillId()))
                    .findFirst()
                    .map(Skill::getName)
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

            producer.publishSkillCreatedEvent(new SkillCreatedEvent(skillName, c.getRating()));
        });

        return savedCompetences;
    }


    public List<Employee> searchBySkillAndRating(String skillName, Optional<Integer> minRating) {
        Skill skill = integration.findSkillByName(skillName);

        List<Competence> profiles = minRating
                .map(rating -> repository.findBySkillIdAndRatingGreaterThanEqual(skill.getId(), rating))
                .orElseGet(() -> repository.findBySkillId(skill.getId()));

        return integration.getEmployees(profiles.stream().map(Competence::getEmployeeId).toList());
    }
}
