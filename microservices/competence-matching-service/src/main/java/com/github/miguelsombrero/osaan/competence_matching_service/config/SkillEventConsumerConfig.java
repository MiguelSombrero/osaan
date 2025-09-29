package com.github.miguelsombrero.osaan.competence_matching_service.config;

import com.github.miguelsombrero.osaan.competence_matching_service.subscription.NotificationService;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
public class SkillEventConsumerConfig {

    private final NotificationService notificationService;

    public SkillEventConsumerConfig(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Bean
    public Consumer<SkillCreatedEvent> skillCreated() {
        return notificationService::processEvent;
    }
}
