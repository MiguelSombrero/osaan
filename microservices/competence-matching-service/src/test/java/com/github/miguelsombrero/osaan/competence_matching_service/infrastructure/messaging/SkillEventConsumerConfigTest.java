package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.messaging;

import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ProcessSkillEventPort;
import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import io.micrometer.tracing.Span;
import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.propagation.Propagator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

import java.util.function.Consumer;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillEventConsumerConfigTest {

    @Mock
    private ProcessSkillEventPort processSkillEventPort;

    @Mock
    private Tracer tracer;

    @Mock
    private Propagator propagator;

    @Mock
    private Span span;

    @Mock
    private Span.Builder spanBuilder;

    @Mock
    private Tracer.SpanInScope spanInScope;

    @InjectMocks
    private SkillEventConsumerConfig consumerConfig;

    private static final SkillCreatedEvent EVENT = new SkillCreatedEvent("Python", 3);

    @Test
    void skillCreated_callsProcessEvent_andEndsSpan() {
        when(propagator.extract(any(), any())).thenReturn(spanBuilder);
        when(spanBuilder.name(any())).thenReturn(spanBuilder);
        when(spanBuilder.start()).thenReturn(span);
        when(tracer.withSpan(span)).thenReturn(spanInScope);

        Message<SkillCreatedEvent> message = MessageBuilder.withPayload(EVENT)
                .setHeader("traceparent", "00-abc123-def456-01")
                .build();

        Consumer<Message<SkillCreatedEvent>> consumer = consumerConfig.skillCreated();
        consumer.accept(message);

        verify(processSkillEventPort).processEvent(EVENT);
        verify(span).end();
        verifyNoMoreInteractions(span);
    }

    @Test
    void skillCreated_tagsErrorAndEndsSpan_whenProcessEventThrows() {
        when(propagator.extract(any(), any())).thenReturn(spanBuilder);
        when(spanBuilder.name(any())).thenReturn(spanBuilder);
        when(spanBuilder.start()).thenReturn(span);
        when(tracer.withSpan(span)).thenReturn(spanInScope);
        RuntimeException cause = new RuntimeException("processing failed");
        doThrow(cause).when(processSkillEventPort).processEvent(any());

        Message<SkillCreatedEvent> message = MessageBuilder.withPayload(EVENT).build();

        Consumer<Message<SkillCreatedEvent>> consumer = consumerConfig.skillCreated();

        assertThatThrownBy(() -> consumer.accept(message))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("processing failed");

        verify(span).error(cause);
        verify(span).end();
    }
}
