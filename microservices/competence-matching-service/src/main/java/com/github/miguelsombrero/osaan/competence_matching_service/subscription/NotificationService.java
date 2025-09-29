package com.github.miguelsombrero.osaan.competence_matching_service.subscription;

import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final SubscriptionRepository repository;
    private final EmailService emailService;

    public NotificationService(SubscriptionRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public void processEvent(SkillCreatedEvent event) {
        List<SubscriptionEntity> matches = repository.findBySkillAndRatingLessThanEqual(event.skill(), event.rating());
        for (SubscriptionEntity sub : matches) {
            emailService.sendNotification(sub.getEmail(), event);
        }
    }
}
