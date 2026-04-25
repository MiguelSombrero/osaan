package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.repository;

import com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.entity.SubscriptionEntity;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;
import java.util.UUID;

public interface SubscriptionJdbcRepository extends ListCrudRepository<SubscriptionEntity, UUID> {
    List<SubscriptionEntity> findBySkillAndRatingLessThanEqual(String skill, int rating);
}
