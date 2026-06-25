package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.config.SkillEventProducerConfig;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.CompetenceIntegration;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;
import com.github.miguelsombrero.osaan.competence_profile_service.integration.Skill;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import com.github.miguelsombrero.osaan.core.security.AuthenticatedUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompetenceServiceTest {

    @Mock
    private CompetenceMapper mapper;

    @Mock
    private CompetenceRepository repository;

    @Mock
    private CompetenceIntegration integration;

    @Mock
    private SkillEventProducerConfig producer;

    @InjectMocks
    private CompetenceService service;

    private static final UUID EMPLOYEE_ID = UUID.randomUUID();
    private static final UUID SKILL_ID = UUID.randomUUID();
    private static final String KEYCLOAK_ID = "keycloak-123";

    private AuthenticatedUser user;
    private Employee employee;
    private Skill skill;

    @BeforeEach
    void setUp() {
        user = new AuthenticatedUser(KEYCLOAK_ID, "John", "Doe", "john@example.com");
        employee = new Employee(EMPLOYEE_ID, "John", "Doe", "john@example.com", KEYCLOAK_ID);
        skill = new Skill(SKILL_ID, "Python");

        lenient().when(integration.getEmployeeByKeycloakId(KEYCLOAK_ID)).thenReturn(Optional.of(employee));
        lenient().when(integration.findSkillById(SKILL_ID)).thenReturn(skill);
        lenient().doNothing().when(producer).publishSkillCreatedEvent(any(SkillCreatedEvent.class));
    }

    @Test
    void searchBySkillAndRating_returnsEmptyList_whenSkillNotFound() {
        when(integration.findSkillByName("spring boot"))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));

        List<EmployeeSearchResult> result = service.searchBySkillAndRating("spring boot", Optional.empty());

        assertThat(result).isEmpty();
    }

    @Test
    void saveCompetences_insertsNewEntity_whenNoExistingCompetenceForSkill() {
        Competence incoming = new Competence(null, null, SKILL_ID, 3);
        CompetenceEntity newEntity = new CompetenceEntity(null, EMPLOYEE_ID, SKILL_ID, 3);
        CompetenceEntity savedEntity = new CompetenceEntity(UUID.randomUUID(), EMPLOYEE_ID, SKILL_ID, 3);
        Competence savedApi = new Competence(savedEntity.getId(), EMPLOYEE_ID, SKILL_ID, 3);

        when(mapper.apiToEntity(incoming, EMPLOYEE_ID)).thenReturn(newEntity);
        when(repository.findByEmployeeIdAndSkillId(EMPLOYEE_ID, SKILL_ID)).thenReturn(Optional.empty());
        when(repository.saveAll(anyList())).thenReturn(List.of(savedEntity));
        when(mapper.entityToApi(savedEntity)).thenReturn(savedApi);

        service.saveCompetences(user, List.of(incoming));

        ArgumentCaptor<List<CompetenceEntity>> captor = ArgumentCaptor.captor();
        verify(repository).saveAll(captor.capture());

        List<CompetenceEntity> saved = captor.getValue();
        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).getId()).isNull();
        assertThat(saved.get(0).getSkillId()).isEqualTo(SKILL_ID);
        assertThat(saved.get(0).getRating()).isEqualTo(3);
    }

    @Test
    void saveCompetences_updatesExistingEntity_whenCompetenceAlreadyExistsForSkill() {
        UUID existingId = UUID.randomUUID();
        Competence incoming = new Competence(null, null, SKILL_ID, 4);
        CompetenceEntity entityFromMapper = new CompetenceEntity(null, EMPLOYEE_ID, SKILL_ID, 4);
        CompetenceEntity existingEntity = new CompetenceEntity(existingId, EMPLOYEE_ID, SKILL_ID, 3);
        CompetenceEntity savedEntity = new CompetenceEntity(existingId, EMPLOYEE_ID, SKILL_ID, 4);
        Competence savedApi = new Competence(existingId, EMPLOYEE_ID, SKILL_ID, 4);

        when(mapper.apiToEntity(incoming, EMPLOYEE_ID)).thenReturn(entityFromMapper);
        when(repository.findByEmployeeIdAndSkillId(EMPLOYEE_ID, SKILL_ID)).thenReturn(Optional.of(existingEntity));
        when(repository.saveAll(anyList())).thenReturn(List.of(savedEntity));
        when(mapper.entityToApi(savedEntity)).thenReturn(savedApi);

        service.saveCompetences(user, List.of(incoming));

        ArgumentCaptor<List<CompetenceEntity>> captor = ArgumentCaptor.captor();
        verify(repository).saveAll(captor.capture());

        List<CompetenceEntity> saved = captor.getValue();
        assertThat(saved).hasSize(1);
        assertThat(saved.get(0).getId()).isEqualTo(existingId);
        assertThat(saved.get(0).getRating()).isEqualTo(4);
    }

    @Test
    void saveCompetences_publishesEventWithEmployeeInfo() {
        Competence incoming = new Competence(null, null, SKILL_ID, 3);
        CompetenceEntity newEntity = new CompetenceEntity(null, EMPLOYEE_ID, SKILL_ID, 3);
        CompetenceEntity savedEntity = new CompetenceEntity(UUID.randomUUID(), EMPLOYEE_ID, SKILL_ID, 3);
        Competence savedApi = new Competence(savedEntity.getId(), EMPLOYEE_ID, SKILL_ID, 3);

        when(mapper.apiToEntity(incoming, EMPLOYEE_ID)).thenReturn(newEntity);
        when(repository.findByEmployeeIdAndSkillId(EMPLOYEE_ID, SKILL_ID)).thenReturn(Optional.empty());
        when(repository.saveAll(anyList())).thenReturn(List.of(savedEntity));
        when(mapper.entityToApi(savedEntity)).thenReturn(savedApi);

        service.saveCompetences(user, List.of(incoming));

        ArgumentCaptor<SkillCreatedEvent> eventCaptor = ArgumentCaptor.captor();
        verify(producer).publishSkillCreatedEvent(eventCaptor.capture());

        SkillCreatedEvent published = eventCaptor.getValue();
        assertThat(published.skill()).isEqualTo("Python");
        assertThat(published.rating()).isEqualTo(3);
        assertThat(published.firstName()).isEqualTo("John");
        assertThat(published.lastName()).isEqualTo("Doe");
        assertThat(published.email()).isEqualTo("john@example.com");
    }

    @Test
    void saveCompetences_upserts_whenSameSkillSavedTwiceWithDifferentRatings() {
        UUID existingId = UUID.randomUUID();

        // First save — no existing entity, so id stays null → INSERT
        Competence firstSave = new Competence(null, null, SKILL_ID, 3);
        CompetenceEntity firstEntity = new CompetenceEntity(null, EMPLOYEE_ID, SKILL_ID, 3);
        CompetenceEntity firstSaved = new CompetenceEntity(existingId, EMPLOYEE_ID, SKILL_ID, 3);
        Competence firstSavedApi = new Competence(existingId, EMPLOYEE_ID, SKILL_ID, 3);

        when(mapper.apiToEntity(firstSave, EMPLOYEE_ID)).thenReturn(firstEntity);
        when(repository.findByEmployeeIdAndSkillId(EMPLOYEE_ID, SKILL_ID)).thenReturn(Optional.empty());
        when(repository.saveAll(anyList())).thenReturn(List.of(firstSaved));
        when(mapper.entityToApi(firstSaved)).thenReturn(firstSavedApi);

        service.saveCompetences(user, List.of(firstSave));

        // Second save — existing entity found, so id is set → UPDATE
        Competence secondSave = new Competence(null, null, SKILL_ID, 4);
        CompetenceEntity secondEntityFromMapper = new CompetenceEntity(null, EMPLOYEE_ID, SKILL_ID, 4);
        CompetenceEntity secondSaved = new CompetenceEntity(existingId, EMPLOYEE_ID, SKILL_ID, 4);
        Competence secondSavedApi = new Competence(existingId, EMPLOYEE_ID, SKILL_ID, 4);

        when(mapper.apiToEntity(secondSave, EMPLOYEE_ID)).thenReturn(secondEntityFromMapper);
        when(repository.findByEmployeeIdAndSkillId(EMPLOYEE_ID, SKILL_ID)).thenReturn(Optional.of(firstSaved));
        when(repository.saveAll(anyList())).thenReturn(List.of(secondSaved));
        when(mapper.entityToApi(secondSaved)).thenReturn(secondSavedApi);

        List<Competence> result = service.saveCompetences(user, List.of(secondSave));

        // The second result has the same id (updated, not duplicated) and the new rating
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(existingId);
        assertThat(result.get(0).getRating()).isEqualTo(4);

        // saveAll called once per invocation, never with duplicate entries
        verify(repository, times(2)).saveAll(anyList());

        // On the second call the entity passed to saveAll had the existing id set
        ArgumentCaptor<Iterable<CompetenceEntity>> secondCaptor = ArgumentCaptor.captor();
        verify(repository, times(2)).saveAll(secondCaptor.capture());
        List<Iterable<CompetenceEntity>> allCalls = secondCaptor.getAllValues();
        List<CompetenceEntity> secondCallEntities = new ArrayList<>();
        allCalls.get(1).forEach(secondCallEntities::add);
        assertThat(secondCallEntities).hasSize(1);
        assertThat(secondCallEntities.get(0).getId()).isEqualTo(existingId);
    }
}
