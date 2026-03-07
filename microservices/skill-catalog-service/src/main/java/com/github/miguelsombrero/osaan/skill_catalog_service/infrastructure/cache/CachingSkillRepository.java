package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.cache;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.repository.SkillRepository;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.repository.SkillRepositoryAdapter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository decorator that adds cache-aside caching for skill lookups.
 * Caches findById and findByNameIgnoreCase; write-through on save; eviction on deleteById.
 */
@Slf4j
@Repository
@Primary
public class CachingSkillRepository implements SkillRepository {

    private static final String KEY_PREFIX = "skill-catalog:skill:";
    private static final String KEY_ID = KEY_PREFIX + "id:";
    private static final String KEY_NAME = KEY_PREFIX + "name:";

    private final SkillRepository delegate;
    private final Cache cache;

    public CachingSkillRepository(SkillRepositoryAdapter delegate, CacheManager cacheManager) {
        this.delegate = delegate;
        this.cache = cacheManager.getCache(CacheNames.SKILLS);
        if (this.cache == null) {
            throw new IllegalStateException("Skills cache not found. Ensure cache configuration provides cache named: "
                    + CacheNames.SKILLS);
        }
    }

    @Override
    public Optional<Skill> findById(UUID id) {
        String key = KEY_ID + id;
        Cache.ValueWrapper wrapper = cache.get(key);
        if (wrapper != null) {
            return Optional.ofNullable((Skill) wrapper.get());
        }
        Optional<Skill> skill = delegate.findById(id);
        skill.ifPresent(s -> cache.put(key, s));
        return skill;
    }

    @Override
    public Optional<Skill> findByNameIgnoreCase(String name) {
        String normalizedKey = normalizeForCacheKey(name);
        String key = KEY_NAME + normalizedKey;
        Cache.ValueWrapper wrapper = cache.get(key);
        if (wrapper != null) {
            return Optional.ofNullable((Skill) wrapper.get());
        }
        Optional<Skill> skill = delegate.findByNameIgnoreCase(name);
        skill.ifPresent(s -> cache.put(key, s));
        return skill;
    }

    @Override
    public Skill save(Skill skill) {
        Skill saved = delegate.save(skill);
        if (saved.id() != null) {
            cache.put(KEY_ID + saved.id(), saved);
        }
        cache.put(KEY_NAME + normalizeForCacheKey(saved.name()), saved);
        return saved;
    }

    @Override
    public void deleteById(UUID id) {
        delegate.findById(id).ifPresent(skill ->
                cache.evict(KEY_NAME + normalizeForCacheKey(skill.name())));
        delegate.deleteById(id);
        cache.evict(KEY_ID + id);
    }

    @Override
    public Page<Skill> findAll(Pageable pageable) {
        return delegate.findAll(pageable);
    }

    @Override
    public List<Skill> findByNameContainingIgnoreCase(String name, Pageable pageable) {
        return delegate.findByNameContainingIgnoreCase(name, pageable);
    }

    @Override
    public long countByNameContainingIgnoreCase(String name) {
        return delegate.countByNameContainingIgnoreCase(name);
    }

    private static String normalizeForCacheKey(String name) {
        return name == null ? "" : name.trim().toLowerCase();
    }
}
