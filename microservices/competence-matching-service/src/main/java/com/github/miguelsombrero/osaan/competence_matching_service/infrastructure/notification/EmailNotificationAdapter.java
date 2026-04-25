package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.notification;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.NotificationPort;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmailNotificationAdapter implements NotificationPort {

    private final JavaMailSender mailSender;

    @Override
    public void sendNotification(String to, SkillCreatedEvent event) {
        log.debug("Sending email to {} about event {}", to, event);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("competence-matching-service");
        message.setTo(to);
        message.setSubject("New Skill Created");
        message.setText("A new skill was created: " + event.skill() + " with rating " + event.rating());
        mailSender.send(message);
    }
}
