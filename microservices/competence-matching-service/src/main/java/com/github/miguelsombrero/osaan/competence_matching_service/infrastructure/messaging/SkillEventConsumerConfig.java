package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.messaging;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ProcessSkillEventPort;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
@RequiredArgsConstructor
public class SkillEventConsumerConfig {

    private final ProcessSkillEventPort processSkillEventPort;

    @Bean
    public Consumer<SkillCreatedEvent> skillCreated() {
        return processSkillEventPort::processEvent;
    }
}
