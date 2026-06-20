package com.github.miguelsombrero.osaan.competence_matching_service.application.port;

import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;

import java.util.List;
import java.util.UUID;

public interface ManageSubscriptionsPort {
    List<Subscription> getSubscriptions(String userId);
    Subscription createSubscription(String userId, String email, String skill, int rating);
    void deleteSubscription(String userId, UUID id);
}
