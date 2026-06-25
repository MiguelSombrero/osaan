package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.notification;

import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class EmailNotificationAdapterTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailNotificationAdapter adapter;

    @Test
    void sendNotification_buildsMessageWithSkillAndEmployeeLine() {
        SkillCreatedEvent event = new SkillCreatedEvent("Python", 3, "John", "Doe", "john@example.com");

        adapter.sendNotification("subscriber@example.com", event);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.captor();
        verify(mailSender).send(captor.capture());

        SimpleMailMessage sent = captor.getValue();
        assertThat(sent.getTo()).containsExactly("subscriber@example.com");
        assertThat(sent.getSubject()).isEqualTo("New Skill Created");
        assertThat(sent.getText()).isEqualTo(
                "A new skill was created: Python with rating 3\n"
                        + "Added by: John Doe (john@example.com)");
    }
}
