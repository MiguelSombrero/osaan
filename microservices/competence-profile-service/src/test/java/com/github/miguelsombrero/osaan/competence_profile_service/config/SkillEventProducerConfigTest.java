package com.github.miguelsombrero.osaan.competence_profile_service.config;

import com.github.miguelsombrero.osaan.core.event.SkillCreatedEvent;
import io.micrometer.tracing.Span;
import io.micrometer.tracing.TraceContext;
import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.propagation.Propagator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.messaging.Message;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillEventProducerConfigTest {

    @Mock
    private StreamBridge streamBridge;

    @Mock
    private Tracer tracer;

    @Mock
    private Propagator propagator;

    @Mock
    private Span span;

    @Mock
    private TraceContext traceContext;

    @InjectMocks
    private SkillEventProducerConfig producer;

    private static final SkillCreatedEvent EVENT = new SkillCreatedEvent("Python", 3);

    @Test
    @SuppressWarnings("unchecked")
    void publishSkillCreatedEvent_injectsTraceparentHeader_whenActiveSpanExists() {
        when(tracer.currentSpan()).thenReturn(span);
        when(span.context()).thenReturn(traceContext);
        doAnswer(invocation -> {
            Map<String, Object> headers = invocation.getArgument(1);
            headers.put("traceparent", "00-abc123-def456-01");
            return null;
        }).when(propagator).inject(eq(traceContext), any(Map.class), any());

        producer.publishSkillCreatedEvent(EVENT);

        ArgumentCaptor<Message<?>> captor = ArgumentCaptor.captor();
        verify(streamBridge).send(eq("skillCreated-out-0"), captor.capture());
        assertThat(captor.getValue().getHeaders().get("traceparent", String.class)).isNotBlank();
    }

    @Test
    void publishSkillCreatedEvent_sendsMessage_whenNoActiveSpan() {
        when(tracer.currentSpan()).thenReturn(null);

        producer.publishSkillCreatedEvent(EVENT);

        verify(streamBridge).send(eq("skillCreated-out-0"), any(Message.class));
        verifyNoInteractions(propagator);
    }
}
