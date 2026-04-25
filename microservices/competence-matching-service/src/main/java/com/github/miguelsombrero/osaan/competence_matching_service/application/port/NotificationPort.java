package com.github.miguelsombrero.osaan.competence_matching_service.application.port;

import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;

public interface NotificationPort {
    void sendNotification(String to, SkillCreatedEvent event);
}
