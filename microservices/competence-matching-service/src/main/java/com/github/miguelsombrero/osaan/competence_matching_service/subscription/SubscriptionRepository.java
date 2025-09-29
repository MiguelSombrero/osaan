package com.github.miguelsombrero.osaan.competence_matching_service.subscription;

import org.springframework.data.repository.ListCrudRepository;

import java.util.List;
import java.util.UUID;

interface SubscriptionRepository extends ListCrudRepository<SubscriptionEntity, UUID> {
    List<SubscriptionEntity> findBySkillAndRatingLessThanEqual(String skill, int rating);
}
