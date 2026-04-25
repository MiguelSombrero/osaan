package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.repository;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.entity.SkillEntity;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.mapper.DomainEntitySkillMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SkillRepositoryAdapterTest {

    private static final UUID SKILL_ID = UUID.fromString("a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5");
    private static final SkillEntity JAVA_ENTITY = new SkillEntity(SKILL_ID, "java");
    private static final Skill JAVA_SKILL = new Skill(SKILL_ID, "java");

    @Mock
    private PagingAndSortingSkillRepository repository;

    @Mock
    private DomainEntitySkillMapper mapper;

    @InjectMocks
    private SkillRepositoryAdapter adapter;

    @Test
    void findById_entityFound_mapsEntityToDomain() {
        when(repository.findById(SKILL_ID)).thenReturn(Optional.of(JAVA_ENTITY));
        when(mapper.entityToDomain(JAVA_ENTITY)).thenReturn(JAVA_SKILL);

        Optional<Skill> result = adapter.findById(SKILL_ID);

        assertThat(result).contains(JAVA_SKILL);
        verify(mapper).entityToDomain(JAVA_ENTITY);
    }

    @Test
    void findById_entityNotFound_returnsEmpty() {
        when(repository.findById(SKILL_ID)).thenReturn(Optional.empty());

        Optional<Skill> result = adapter.findById(SKILL_ID);

        assertThat(result).isEmpty();
    }

    @Test
    void save_mapsDomainToEntitySavesAndMapsBack() {
        SkillEntity unsavedEntity = new SkillEntity(null, "java");
        Skill unsavedSkill = new Skill(null, "java");
        when(mapper.domainToEntity(unsavedSkill)).thenReturn(unsavedEntity);
        when(repository.save(unsavedEntity)).thenReturn(JAVA_ENTITY);
        when(mapper.entityToDomain(JAVA_ENTITY)).thenReturn(JAVA_SKILL);

        Skill result = adapter.save(unsavedSkill);

        assertThat(result).isEqualTo(JAVA_SKILL);
        verify(mapper).domainToEntity(unsavedSkill);
        verify(repository).save(unsavedEntity);
        verify(mapper).entityToDomain(JAVA_ENTITY);
    }

    @Test
    void findAll_mapsAllEntitiesToDomain() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<SkillEntity> entityPage = new PageImpl<>(List.of(JAVA_ENTITY), pageable, 1);
        when(repository.findAll(pageable)).thenReturn(entityPage);
        when(mapper.entityToDomain(JAVA_ENTITY)).thenReturn(JAVA_SKILL);

        Page<Skill> result = adapter.findAll(pageable);

        assertThat(result.getContent()).containsExactly(JAVA_SKILL);
        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    void findByNameIgnoreCase_entityFound_mapsEntityToDomain() {
        when(repository.findByNameIgnoreCase("java")).thenReturn(Optional.of(JAVA_ENTITY));
        when(mapper.entityToDomain(JAVA_ENTITY)).thenReturn(JAVA_SKILL);

        Optional<Skill> result = adapter.findByNameIgnoreCase("java");

        assertThat(result).contains(JAVA_SKILL);
    }

    @Test
    void findByNameContainingIgnoreCase_mapsAllMatchingEntitiesToDomain() {
        Pageable pageable = PageRequest.of(0, 10);
        when(repository.findByNameContainingIgnoreCase("java", pageable)).thenReturn(List.of(JAVA_ENTITY));
        when(mapper.entityToDomain(JAVA_ENTITY)).thenReturn(JAVA_SKILL);

        List<Skill> result = adapter.findByNameContainingIgnoreCase("java", pageable);

        assertThat(result).containsExactly(JAVA_SKILL);
    }

    @Test
    void countByNameContainingIgnoreCase_delegatesToRepository() {
        when(repository.countByNameContainingIgnoreCase("java")).thenReturn(5L);

        long result = adapter.countByNameContainingIgnoreCase("java");

        assertThat(result).isEqualTo(5L);
    }

    @Test
    void deleteById_delegatesToRepository() {
        adapter.deleteById(SKILL_ID);

        verify(repository).deleteById(SKILL_ID);
    }
}
