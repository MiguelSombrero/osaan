package com.github.miguelsombrero.osaan.competence_profile_service.config;

import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import io.micrometer.tracing.Span;
import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.propagation.Propagator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.support.MessageBuilder;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
public class SkillEventProducerConfig {

    private final StreamBridge streamBridge;
    private final Tracer tracer;
    private final Propagator propagator;

    public SkillEventProducerConfig(StreamBridge streamBridge, Tracer tracer, Propagator propagator) {
        this.streamBridge = streamBridge;
        this.tracer = tracer;
        this.propagator = propagator;
    }

    public void publishSkillCreatedEvent(SkillCreatedEvent event) {
        Map<String, Object> traceHeaders = new HashMap<>();
        Span currentSpan = tracer.currentSpan();
        if (currentSpan != null) {
            propagator.inject(currentSpan.context(), traceHeaders, Map::put);
        }
        log.debug("Publishing SkillCreatedEvent with skill: {}, rating: {}", event.skill(), event.rating());
        streamBridge.send("skillCreated-out-0",
                MessageBuilder.withPayload(event).copyHeaders(traceHeaders).build());
    }
}
