package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.messaging;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ProcessSkillEventPort;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import io.micrometer.tracing.Span;
import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.propagation.Propagator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

import java.util.function.Consumer;

@Configuration
@RequiredArgsConstructor
public class SkillEventConsumerConfig {

    private final ProcessSkillEventPort processSkillEventPort;
    private final Tracer tracer;
    private final Propagator propagator;

    @Bean
    public Consumer<Message<SkillCreatedEvent>> skillCreated() {
        return message -> {
            Span span = propagator
                    .extract(message.getHeaders(), (headers, key) -> headers.get(key, String.class))
                    .name("skillCreated process")
                    .start();
            try (Tracer.SpanInScope ignored = tracer.withSpan(span)) {
                processSkillEventPort.processEvent(message.getPayload());
            } catch (RuntimeException e) {
                span.error(e);
                throw e;
            } finally {
                span.end();
            }
        };
    }
}
