package com.github.miguelsombrero.osaan.skill_catalog_service.application.service;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.repository.SkillRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ManageSkillsServiceTest {

    private static final UUID SKILL_ID = UUID.fromString("a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5");
    private static final Skill JAVA_SKILL = new Skill(SKILL_ID, "java");

    @Mock
    private SkillRepository repository;

    @InjectMocks
    private ManageSkillsService service;

    @Test
    void createSkill_validName_normalizesNameBeforeSaving() {
        when(repository.save(any(Skill.class))).thenReturn(JAVA_SKILL);

        service.createSkill("  Java  ");

        ArgumentCaptor<Skill> captor = ArgumentCaptor.forClass(Skill.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().name()).isEqualTo("java");
        assertThat(captor.getValue().id()).isNull();
    }

    @Test
    void createSkill_validName_returnsSavedSkill() {
        when(repository.save(any(Skill.class))).thenReturn(JAVA_SKILL);

        Skill result = service.createSkill("java");

        assertThat(result).isEqualTo(JAVA_SKILL);
    }

    @Test
    void createSkill_blankName_throwsWithoutCallingRepository() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> service.createSkill("   "));

        verify(repository, never()).save(any());
    }

    @Test
    void createSkill_nullName_throwsWithoutCallingRepository() {
        assertThatExceptionOfType(NullPointerException.class)
                .isThrownBy(() -> service.createSkill(null));

        verify(repository, never()).save(any());
    }

    @Test
    void getSkill_existingId_returnsSkill() {
        when(repository.findById(SKILL_ID)).thenReturn(Optional.of(JAVA_SKILL));

        Skill result = service.getSkill(SKILL_ID);

        assertThat(result).isEqualTo(JAVA_SKILL);
    }

    @Test
    void getSkill_nonExistingId_throwsResourceNotFoundException() {
        when(repository.findById(SKILL_ID)).thenReturn(Optional.empty());

        assertThatExceptionOfType(ResourceNotFoundException.class)
                .isThrownBy(() -> service.getSkill(SKILL_ID))
                .withMessage("Skill not found");
    }

    @Test
    void getSkillByName_existingName_returnsSkill() {
        when(repository.findByNameIgnoreCase("java")).thenReturn(Optional.of(JAVA_SKILL));

        Skill result = service.getSkillByName("java");

        assertThat(result).isEqualTo(JAVA_SKILL);
    }

    @Test
    void getSkillByName_nonExistingName_throwsResourceNotFoundException() {
        when(repository.findByNameIgnoreCase("unknown")).thenReturn(Optional.empty());

        assertThatExceptionOfType(ResourceNotFoundException.class)
                .isThrownBy(() -> service.getSkillByName("unknown"))
                .withMessage("Skill not found");
    }

    @Test
    void getSkills_withQuery_usesFilteredQueryAndCustomCount() {
        Pageable pageable = PageRequest.of(0, 10);
        when(repository.findByNameContainingIgnoreCase("java", pageable)).thenReturn(List.of(JAVA_SKILL));
        when(repository.countByNameContainingIgnoreCase("java")).thenReturn(1L);

        Page<Skill> result = service.getSkills("java", pageable);

        assertThat(result.getContent()).containsExactly(JAVA_SKILL);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(repository, never()).findAll(any(Pageable.class));
    }

    @Test
    void getSkills_nullQuery_usesUnfilteredFindAll() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Skill> page = new PageImpl<>(List.of(JAVA_SKILL), pageable, 1);
        when(repository.findAll(pageable)).thenReturn(page);

        Page<Skill> result = service.getSkills(null, pageable);

        assertThat(result.getContent()).containsExactly(JAVA_SKILL);
        verify(repository, never()).findByNameContainingIgnoreCase(any(), any());
    }

    @Test
    void getSkills_blankQuery_usesUnfilteredFindAll() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Skill> page = new PageImpl<>(List.of(JAVA_SKILL), pageable, 1);
        when(repository.findAll(pageable)).thenReturn(page);

        Page<Skill> result = service.getSkills("   ", pageable);

        assertThat(result.getContent()).containsExactly(JAVA_SKILL);
        verify(repository, never()).findByNameContainingIgnoreCase(any(), any());
    }

    @Test
    void getSkills_withQueryAndNoMatches_returnsEmptyPage() {
        Pageable pageable = PageRequest.of(0, 10);
        when(repository.findByNameContainingIgnoreCase("nosuchskill", pageable)).thenReturn(List.of());
        when(repository.countByNameContainingIgnoreCase("nosuchskill")).thenReturn(0L);

        Page<Skill> result = service.getSkills("nosuchskill", pageable);

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
        assertThat(result.getTotalPages()).isEqualTo(0);
    }

    @Test
    void getSkills_paginationMetadataPreserved() {
        Pageable pageable = PageRequest.of(2, 5);
        when(repository.findByNameContainingIgnoreCase("java", pageable)).thenReturn(List.of(JAVA_SKILL));
        when(repository.countByNameContainingIgnoreCase("java")).thenReturn(11L);

        Page<Skill> result = service.getSkills("java", pageable);

        assertThat(result.getNumber()).isEqualTo(2);
        assertThat(result.getSize()).isEqualTo(5);
        assertThat(result.getTotalElements()).isEqualTo(11);
    }

    @Test
    void deleteSkill_delegatesToRepository() {
        service.deleteSkill(SKILL_ID);

        verify(repository).deleteById(SKILL_ID);
    }
}
