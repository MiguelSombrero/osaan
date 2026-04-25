package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.config.SkillEventProducerConfig;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.CompetenceIntegration;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Skill;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import com.github.miguelsombrero.osaan.core.security.AuthenticatedUser;
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

    public List<Competence> saveCompetences(AuthenticatedUser user, List<Competence> competences) {
        Employee employee = resolveOrCreateEmployee(user);
        UUID employeeId = employee.getId();

        List<Skill> skills = competences.stream()
                .map(c -> integration.findSkillById(c.getSkillId()))
                .toList();

        List<CompetenceEntity> entities = competences.stream()
                .map(c -> mapper.apiToEntity(c, employeeId))
                .toList();

        List<Competence> savedCompetences = repository.saveAll(entities).stream()
                .map(mapper::entityToApi)
                .toList();

        savedCompetences.forEach(c -> {
            String skillName = skills.stream()
                    .filter(s -> s.getId().equals(c.getSkillId()))
                    .findFirst()
                    .map(Skill::getName)
                    .orElseThrow();

            producer.publishSkillCreatedEvent(new SkillCreatedEvent(skillName, c.getRating()));
        });

        return savedCompetences;
    }

    public CompetenceProfile getProfile(AuthenticatedUser user) {
        Optional<Employee> employee = integration.getEmployeeByKeycloakId(user.keycloakId());

        if (employee.isEmpty()) {
            return new CompetenceProfile(null, List.of());
        }

        UUID employeeId = employee.get().getId();

        List<CompetenceDetail> competences = repository.findByEmployeeId(employeeId).stream()
                .map(c -> {
                    Skill skill = integration.findSkillById(c.getSkillId());
                    return new CompetenceDetail(c.getId(), skill.getName(), c.getRating());
                })
                .toList();

        return new CompetenceProfile(employee.get(), competences);
    }

    public List<Employee> searchBySkillAndRating(String skillName, Optional<Integer> minRating) {
        Skill skill = integration.findSkillByName(skillName);

        List<Competence> profiles = minRating
                .map(rating -> repository.findBySkillIdAndRatingGreaterThanEqual(skill.getId(), rating))
                .orElseGet(() -> repository.findBySkillId(skill.getId()));

        return integration.getEmployees(profiles.stream().map(Competence::getEmployeeId).toList());
    }

    private Employee resolveOrCreateEmployee(AuthenticatedUser user) {
        return integration.getEmployeeByKeycloakId(user.keycloakId())
                .orElseGet(() -> {
                    log.info("Creating new employee for Keycloak user {}", user.keycloakId());
                    return integration.createEmployee(user);
                });
    }
}
