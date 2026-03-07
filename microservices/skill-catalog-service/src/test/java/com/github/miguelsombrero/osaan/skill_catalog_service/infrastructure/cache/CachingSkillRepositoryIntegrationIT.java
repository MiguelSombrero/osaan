package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.cache;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import com.github.miguelsombrero.osaan.skill_catalog_service.TestcontainersConfiguration;
import com.github.miguelsombrero.osaan.skill_catalog_service.application.port.ManageSkillsPort;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.repository.SkillRepositoryAdapter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@ActiveProfiles("test")
class CachingSkillRepositoryIntegrationIT {

    private static final UUID JAVA_SKILL_ID = UUID.fromString("a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5");

    @Autowired
    private ManageSkillsPort manageSkillsPort;

    @Autowired
    private CacheManager cacheManager;

    @MockitoSpyBean
    private SkillRepositoryAdapter skillRepositoryAdapter;

    @Test
    void findById_secondCallUsesCache() {
        manageSkillsPort.getSkill(JAVA_SKILL_ID);
        manageSkillsPort.getSkill(JAVA_SKILL_ID);

        verify(skillRepositoryAdapter).findById(JAVA_SKILL_ID);
    }

    @Test
    void findByNameIgnoreCase_secondCallUsesCache() {
        manageSkillsPort.getSkillByName("java");
        manageSkillsPort.getSkillByName("JAVA");

        verify(skillRepositoryAdapter).findByNameIgnoreCase("java");
    }

    @Test
    void deleteById_evictsCache() {
        // createSkill does write-through, so the skill is cached immediately. Evict it so the
        // first getSkill is a cache miss (findById called), otherwise we cannot verify caching.
        Skill created = manageSkillsPort.createSkill("cache-evict-test");
        UUID id = created.id();
        assert id != null : "Saved skill must have id";
        evictSkillFromCache(id, created.name());

        manageSkillsPort.getSkill(id);
        manageSkillsPort.getSkill(id);
        verify(skillRepositoryAdapter, times(1)).findById(id);

        manageSkillsPort.deleteSkill(id);

        assertThatThrownBy(() -> manageSkillsPort.getSkill(id))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(skillRepositoryAdapter, times(3)).findById(id);
    }

    private void evictSkillFromCache(UUID id, String name) {
        var cache = cacheManager.getCache(CacheNames.SKILLS);
        if (cache != null) {
            cache.evict("skill-catalog:skill:id:" + id);
            cache.evict("skill-catalog:skill:name:" + (name != null ? name.trim().toLowerCase() : ""));
        }
    }

    @Test
    void findAll_notCached() {
        manageSkillsPort.getSkills(null, PageRequest.of(0, 20));
        manageSkillsPort.getSkills(null, PageRequest.of(0, 20));

        verify(skillRepositoryAdapter, times(2)).findAll(PageRequest.of(0, 20));
    }
}
