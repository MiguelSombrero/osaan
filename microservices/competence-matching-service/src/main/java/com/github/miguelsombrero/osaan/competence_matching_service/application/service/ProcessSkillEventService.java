package com.github.miguelsombrero.osaan.competence_matching_service.application.service;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.NotificationPort;
import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ProcessSkillEventPort;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.repository.SubscriptionRepository;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessSkillEventService implements ProcessSkillEventPort {

    private final SubscriptionRepository repository;
    private final NotificationPort notificationPort;

    @Override
    public void processEvent(SkillCreatedEvent event) {
        List<Subscription> matches = repository.findBySkillAndRatingLessThanEqual(event.skill(), event.rating());
        for (Subscription subscription : matches) {
            notificationPort.sendNotification(subscription.getEmail(), event);
        }
    }
}
