package com.github.miguelsombrero.osaan.competence_matching_service.domain.repository;

import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;

import java.util.List;

public interface SubscriptionRepository {
    List<Subscription> findAll();
    Subscription save(Subscription subscription);
    List<Subscription> findBySkillAndRatingLessThanEqual(String skill, int rating);
}
