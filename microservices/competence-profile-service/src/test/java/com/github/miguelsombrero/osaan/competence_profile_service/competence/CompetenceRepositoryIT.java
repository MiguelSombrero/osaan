package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DataIntegrityViolationException;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest(properties = {
        "app.auth.disabled=true",
        "employee.service.url=http://localhost:0",
        "skill.service.url=http://localhost:0",
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration"
})
@Testcontainers
class CompetenceRepositoryIT {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"));

    @Autowired
    private CompetenceRepository repository;

    @Test
    void findByEmployeeIdAndSkillId_returnsEmpty_whenNoMatchingCompetenceExists() {
        Optional<CompetenceEntity> result = repository.findByEmployeeIdAndSkillId(UUID.randomUUID(), UUID.randomUUID());

        assertThat(result).isEmpty();
    }

    @Test
    void findByEmployeeIdAndSkillId_returnsEntity_whenMatchingCompetenceExists() {
        UUID employeeId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        CompetenceEntity saved = repository.save(new CompetenceEntity(null, employeeId, skillId, 3));

        Optional<CompetenceEntity> result = repository.findByEmployeeIdAndSkillId(employeeId, skillId);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(saved.getId());
        assertThat(result.get().getEmployeeId()).isEqualTo(employeeId);
        assertThat(result.get().getSkillId()).isEqualTo(skillId);
        assertThat(result.get().getRating()).isEqualTo(3);
    }

    @Test
    void findByEmployeeIdAndSkillId_returnsEmpty_whenDifferentEmployeeHasSameSkill() {
        UUID skillId = UUID.randomUUID();
        repository.save(new CompetenceEntity(null, UUID.randomUUID(), skillId, 3));

        Optional<CompetenceEntity> result = repository.findByEmployeeIdAndSkillId(UUID.randomUUID(), skillId);

        assertThat(result).isEmpty();
    }

    @Test
    void uniqueConstraint_preventsInsertOfDuplicateEmployeeSkillPair() {
        UUID employeeId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        repository.save(new CompetenceEntity(null, employeeId, skillId, 3));

        assertThatThrownBy(() -> repository.save(new CompetenceEntity(null, employeeId, skillId, 5)))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void save_updatesRating_whenEntityWithExistingIdIsSaved() {
        UUID employeeId = UUID.randomUUID();
        UUID skillId = UUID.randomUUID();
        CompetenceEntity saved = repository.save(new CompetenceEntity(null, employeeId, skillId, 3));

        // Simulate what the service upsert does: find existing entity, copy its id onto the updated entity, save
        CompetenceEntity updated = new CompetenceEntity(saved.getId(), employeeId, skillId, 5);
        repository.save(updated);

        Optional<CompetenceEntity> result = repository.findByEmployeeIdAndSkillId(employeeId, skillId);
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(saved.getId());
        assertThat(result.get().getRating()).isEqualTo(5);
        assertThat(repository.findByEmployeeId(employeeId)).hasSize(1);
    }
}
