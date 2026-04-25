package com.github.miguelsombrero.osaan.competence_matching_service.application.service;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ManageSubscriptionsPort;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManageSubscriptionsService implements ManageSubscriptionsPort {

    private final SubscriptionRepository repository;

    @Override
    public List<Subscription> getSubscriptions() {
        return repository.findAll();
    }

    @Override
    public Subscription saveSubscription(Subscription subscription) {
        log.debug("Saving subscription : {}", subscription);
        return repository.save(subscription);
    }
}
