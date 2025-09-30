package com.github.miguelsombrero.osaan.competence_matching_service.subscription;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
class SubscriptionService {

    private final SubscriptionMapper mapper;
    private final SubscriptionRepository repository;

    SubscriptionService(SubscriptionMapper mapper, SubscriptionRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    public List<Subscription> getSubscriptions() {
        return repository.findAll().stream()
                .map(mapper::entityToApi)
                .toList();
    }

    public Subscription saveSubscription(Subscription subscription) {
        log.debug("Saving subscription : {}", subscription);
        SubscriptionEntity entity = mapper.apiToEntity(subscription);
        return mapper.entityToApi(repository.save(entity));
    }

}
