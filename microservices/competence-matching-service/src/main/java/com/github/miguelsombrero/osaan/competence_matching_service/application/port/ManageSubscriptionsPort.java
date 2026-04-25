package com.github.miguelsombrero.osaan.competence_matching_service.application.port;

import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;

import java.util.List;

public interface ManageSubscriptionsPort {
    List<Subscription> getSubscriptions();
    Subscription saveSubscription(Subscription subscription);
}
