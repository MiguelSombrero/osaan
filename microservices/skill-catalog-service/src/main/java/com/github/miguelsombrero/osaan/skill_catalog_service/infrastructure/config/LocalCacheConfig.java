package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.cache.CacheNames;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.concurrent.TimeUnit;

/**
 * Cache configuration for local profile. Uses Caffeine in-memory cache.
 */
@Configuration
@EnableCaching
@Profile({"local", "test"})
public class LocalCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(CacheNames.SKILLS);
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(1000));
        return cacheManager;
    }
}
