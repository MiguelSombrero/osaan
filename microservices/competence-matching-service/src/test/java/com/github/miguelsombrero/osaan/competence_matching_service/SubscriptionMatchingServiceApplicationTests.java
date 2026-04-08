package com.github.miguelsombrero.osaan.competence_matching_service;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSender;

@Import({TestcontainersConfiguration.class, SubscriptionMatchingServiceApplicationTests.MailTestConfiguration.class})
@SpringBootTest
class SubscriptionMatchingServiceApplicationTests {

    @Test
    void contextLoads() {
    }

    @TestConfiguration
    static class MailTestConfiguration {

        @Bean
        JavaMailSender javaMailSender() {
            return Mockito.mock(JavaMailSender.class);
        }
    }
}
