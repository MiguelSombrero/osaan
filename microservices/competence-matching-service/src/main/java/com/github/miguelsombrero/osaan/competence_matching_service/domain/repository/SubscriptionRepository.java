package com.github.miguelsombrero.osaan.competence_matching_service.domain.repository;

import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;

import java.util.List;
import java.util.UUID;

public interface SubscriptionRepository {
    List<Subscription> findByUserId(String userId);
    Subscription save(Subscription subscription);
    int deleteByIdAndUserId(UUID id, String userId);
    List<Subscription> findBySkillAndRatingLessThanEqual(String skill, int rating);
}
