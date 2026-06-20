package com.github.miguelsombrero.osaan.competence_matching_service.application.service;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ManageSubscriptionsPort;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.repository.SubscriptionRepository;
import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ManageSubscriptionsService implements ManageSubscriptionsPort {

    private final SubscriptionRepository repository;

    @Override
    public List<Subscription> getSubscriptions(String userId) {
        return repository.findByUserId(userId);
    }

    @Override
    public Subscription createSubscription(String userId, String email, String skill, int rating) {
        Subscription subscription = new Subscription(
                null,
                userId,
                email,
                skill.trim(),
                rating,
                Instant.now()
        );
        log.debug("Saving subscription : {}", subscription);
        return repository.save(subscription);
    }

    @Override
    public void deleteSubscription(String userId, UUID id) {
        int deleted = repository.deleteByIdAndUserId(id, userId);
        if (deleted == 0) {
            throw new ResourceNotFoundException("Subscription not found");
        }
    }
}
