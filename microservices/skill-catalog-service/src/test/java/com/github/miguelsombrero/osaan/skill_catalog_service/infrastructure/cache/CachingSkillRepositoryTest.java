package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.cache;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.repository.SkillRepositoryAdapter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CachingSkillRepositoryTest {

    private static final UUID SKILL_ID = UUID.fromString("a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5");
    private static final Skill SKILL = new Skill(SKILL_ID, "java");

    @Mock
    private SkillRepositoryAdapter delegate;

    @Mock
    private Cache cache;

    @Mock
    private CacheManager cacheManager;

    private CachingSkillRepository repository;

    @BeforeEach
    void setUp() {
        when(cacheManager.getCache(CacheNames.SKILLS)).thenReturn(cache);
        repository = new CachingSkillRepository(delegate, cacheManager);
    }

    @Test
    void findById_cacheMiss_delegatesAndPutsInCache() {
        when(cache.get(any())).thenReturn(null);
        when(delegate.findById(SKILL_ID)).thenReturn(Optional.of(SKILL));

        Optional<Skill> result = repository.findById(SKILL_ID);

        assertThat(result).contains(SKILL);
        verify(delegate, times(1)).findById(SKILL_ID);
        verify(cache).put("skill-catalog:skill:id:" + SKILL_ID, SKILL);
    }

    @Test
    void findById_cacheHit_doesNotDelegate() {
        when(cache.get("skill-catalog:skill:id:" + SKILL_ID))
                .thenReturn(() -> SKILL);

        Optional<Skill> result = repository.findById(SKILL_ID);

        assertThat(result).contains(SKILL);
        verify(delegate, never()).findById(any());
        verify(cache, never()).put(any(), any());
    }

    @Test
    void findById_cacheMissNotFound_doesNotPutInCache() {
        when(cache.get(any())).thenReturn(null);
        when(delegate.findById(SKILL_ID)).thenReturn(Optional.empty());

        Optional<Skill> result = repository.findById(SKILL_ID);

        assertThat(result).isEmpty();
        verify(delegate, times(1)).findById(SKILL_ID);
        verify(cache, never()).put(any(), any());
    }

    @Test
    void findByNameIgnoreCase_cacheMiss_delegatesAndPutsInCache() {
        when(cache.get(any())).thenReturn(null);
        when(delegate.findByNameIgnoreCase("java")).thenReturn(Optional.of(SKILL));

        Optional<Skill> result = repository.findByNameIgnoreCase("java");

        assertThat(result).contains(SKILL);
        verify(delegate, times(1)).findByNameIgnoreCase("java");
        verify(cache).put(eq("skill-catalog:skill:name:java"), eq(SKILL));
    }

    @Test
    void findByNameIgnoreCase_cacheHit_doesNotDelegate() {
        when(cache.get("skill-catalog:skill:name:java"))
                .thenReturn(() -> SKILL);

        Optional<Skill> result = repository.findByNameIgnoreCase("java");

        assertThat(result).contains(SKILL);
        verify(delegate, never()).findByNameIgnoreCase(any());
        verify(cache, never()).put(any(), any());
    }

    @Test
    void findByNameIgnoreCase_normalizesKey() {
        when(cache.get(any())).thenReturn(null);
        when(delegate.findByNameIgnoreCase("Java")).thenReturn(Optional.of(SKILL));

        repository.findByNameIgnoreCase("Java");

        verify(cache).put(eq("skill-catalog:skill:name:java"), eq(SKILL));

        when(cache.get("skill-catalog:skill:name:java")).thenReturn(() -> SKILL);
        Optional<Skill> result = repository.findByNameIgnoreCase("JAVA");

        assertThat(result).contains(SKILL);
        verify(delegate, times(1)).findByNameIgnoreCase("Java");
    }

    @Test
    void save_putsInCacheByIdAndName() {
        when(delegate.save(SKILL)).thenReturn(SKILL);

        Skill result = repository.save(SKILL);

        assertThat(result).isEqualTo(SKILL);
        verify(delegate, times(1)).save(SKILL);
        verify(cache).put("skill-catalog:skill:id:" + SKILL_ID, SKILL);
        verify(cache).put("skill-catalog:skill:name:java", SKILL);
    }

    @Test
    void deleteById_evictsBothKeysAndDelegates() {
        when(delegate.findById(SKILL_ID)).thenReturn(Optional.of(SKILL));

        repository.deleteById(SKILL_ID);

        verify(delegate).findById(SKILL_ID);
        verify(cache).evict("skill-catalog:skill:name:java");
        verify(delegate).deleteById(SKILL_ID);
        verify(cache).evict("skill-catalog:skill:id:" + SKILL_ID);
    }

    @Test
    void findAll_delegatesOnly() {
        Page<Skill> page = new PageImpl<>(List.of(SKILL), PageRequest.of(0, 20), 1);
        when(delegate.findAll(PageRequest.of(0, 20))).thenReturn(page);

        Page<Skill> result = repository.findAll(PageRequest.of(0, 20));

        assertThat(result.getContent()).containsExactly(SKILL);
        verify(delegate, times(1)).findAll(PageRequest.of(0, 20));
        verify(cache, never()).get(any());
        verify(cache, never()).put(any(), any());
    }

    @Test
    void findByNameContainingIgnoreCase_delegatesOnly() {
        when(delegate.findByNameContainingIgnoreCase("java", PageRequest.of(0, 20)))
                .thenReturn(List.of(SKILL));

        List<Skill> result = repository.findByNameContainingIgnoreCase("java", PageRequest.of(0, 20));

        assertThat(result).containsExactly(SKILL);
        verify(delegate, times(1)).findByNameContainingIgnoreCase("java", PageRequest.of(0, 20));
        verify(cache, never()).get(any());
        verify(cache, never()).put(any(), any());
    }
}
