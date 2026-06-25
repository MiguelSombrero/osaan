package com.github.miguelsombrero.osaan.competence_matching_service.application.service;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.NotificationPort;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.repository.SubscriptionRepository;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProcessSkillEventServiceTest {

    @Mock
    private SubscriptionRepository repository;

    @Mock
    private NotificationPort notificationPort;

    @InjectMocks
    private ProcessSkillEventService service;

    private static final SkillCreatedEvent EVENT =
            new SkillCreatedEvent("Python", 3, "John", "Doe", "john@example.com");

    @Test
    void processEvent_sendsNotificationToEachMatchingSubscriber() {
        Subscription first = new Subscription(UUID.randomUUID(), "user-1", "a@example.com", "Python", 2, Instant.now());
        Subscription second = new Subscription(UUID.randomUUID(), "user-2", "b@example.com", "Python", 3, Instant.now());
        when(repository.findBySkillAndRatingLessThanEqual("Python", 3)).thenReturn(List.of(first, second));

        service.processEvent(EVENT);

        verify(notificationPort).sendNotification("a@example.com", EVENT);
        verify(notificationPort).sendNotification("b@example.com", EVENT);
    }

    @Test
    void processEvent_doesNothing_whenNoSubscriptionsMatch() {
        when(repository.findBySkillAndRatingLessThanEqual("Python", 3)).thenReturn(List.of());

        service.processEvent(EVENT);

        verifyNoInteractions(notificationPort);
    }
}
