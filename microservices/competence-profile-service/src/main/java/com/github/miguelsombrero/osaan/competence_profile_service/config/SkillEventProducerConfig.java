package com.github.miguelsombrero.osaan.competence_profile_service.config;

import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SkillEventProducerConfig {

    private final StreamBridge streamBridge;

    public SkillEventProducerConfig(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

    public void publishSkillCreatedEvent(SkillCreatedEvent event) {
        streamBridge.send("skillCreated-out-0", event);
    }
}

