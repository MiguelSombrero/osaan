package com.github.miguelsombrero.osaan.competence_matching_service.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.miguelsombrero.osaan.competence_matching_service.api.dto.SubscriptionDto;
import com.github.miguelsombrero.osaan.competence_matching_service.api.mapper.ApiDomainSubscriptionMapper;
import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ManageSubscriptionsPort;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SubscriptionControllerTest {

    private static final String USER_ID = "11111111-2222-3333-4444-555555555555";
    private static final String EMAIL = "anna.korhonen@example.com";
    private static final UUID SUB_ID = UUID.fromString("c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8");
    private static final Instant CREATED_AT = Instant.parse("2026-06-19T10:00:00Z");

    private static final Jwt TEST_JWT = Jwt.withTokenValue("test")
            .header("alg", "none")
            .subject(USER_ID)
            .claim("email", EMAIL)
            .build();

    @Mock
    private ManageSubscriptionsPort manageSubscriptionsPort;

    @Mock
    private ApiDomainSubscriptionMapper mapper;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        SubscriptionController controller = new SubscriptionController(manageSubscriptionsPort, mapper);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new JwtArgumentResolver(TEST_JWT))
                .setControllerAdvice(new LocalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
    }

    @Test
    void getSubscriptions_returnsListForAuthenticatedUser() throws Exception {
        Subscription domain = new Subscription(SUB_ID, USER_ID, EMAIL, "python", 3, CREATED_AT);
        SubscriptionDto dto = new SubscriptionDto(SUB_ID, USER_ID, EMAIL, "python", 3, CREATED_AT);
        when(manageSubscriptionsPort.getSubscriptions(USER_ID)).thenReturn(List.of(domain));
        when(mapper.domainToApi(domain)).thenReturn(dto);

        mockMvc.perform(get("/v1/subscriptions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(SUB_ID.toString()))
                .andExpect(jsonPath("$[0].userId").value(USER_ID))
                .andExpect(jsonPath("$[0].email").value(EMAIL))
                .andExpect(jsonPath("$[0].skill").value("python"))
                .andExpect(jsonPath("$[0].rating").value(3));

        verify(manageSubscriptionsPort).getSubscriptions(USER_ID);
    }

    @Test
    void createSubscription_validBody_returns201WithLocationHeader() throws Exception {
        Subscription created = new Subscription(SUB_ID, USER_ID, EMAIL, "python", 3, CREATED_AT);
        SubscriptionDto dto = new SubscriptionDto(SUB_ID, USER_ID, EMAIL, "python", 3, CREATED_AT);
        when(manageSubscriptionsPort.createSubscription(USER_ID, EMAIL, "python", 3)).thenReturn(created);
        when(mapper.domainToApi(created)).thenReturn(dto);

        mockMvc.perform(post("/v1/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("skill", "python", "rating", 3))))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/v1/subscriptions/" + SUB_ID))
                .andExpect(jsonPath("$.id").value(SUB_ID.toString()))
                .andExpect(jsonPath("$.skill").value("python"));

        verify(manageSubscriptionsPort).createSubscription(USER_ID, EMAIL, "python", 3);
    }

    @Test
    void createSubscription_blankSkill_returns400() throws Exception {
        mockMvc.perform(post("/v1/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("skill", "", "rating", 3))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createSubscription_ratingTooHigh_returns400() throws Exception {
        mockMvc.perform(post("/v1/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("skill", "python", "rating", 6))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createSubscription_ratingTooLow_returns400() throws Exception {
        mockMvc.perform(post("/v1/subscriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("skill", "python", "rating", 0))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteSubscription_existingForUser_returns204() throws Exception {
        mockMvc.perform(delete("/v1/subscriptions/{id}", SUB_ID))
                .andExpect(status().isNoContent());

        verify(manageSubscriptionsPort).deleteSubscription(USER_ID, SUB_ID);
    }

    @Test
    void deleteSubscription_notOwnedOrMissing_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Subscription not found"))
                .when(manageSubscriptionsPort).deleteSubscription(USER_ID, SUB_ID);

        mockMvc.perform(delete("/v1/subscriptions/{id}", SUB_ID))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteSubscription_invalidUuid_returns400() throws Exception {
        mockMvc.perform(delete("/v1/subscriptions/not-a-uuid"))
                .andExpect(status().isBadRequest());
    }

    private record JwtArgumentResolver(Jwt jwt) implements HandlerMethodArgumentResolver {
        @Override
        public boolean supportsParameter(MethodParameter parameter) {
            return Jwt.class.isAssignableFrom(parameter.getParameterType());
        }

        @Override
        public Object resolveArgument(MethodParameter parameter,
                                      ModelAndViewContainer mavContainer,
                                      NativeWebRequest webRequest,
                                      WebDataBinderFactory binderFactory) {
            return jwt;
        }
    }

    @RestControllerAdvice
    static class LocalExceptionHandler {
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<Void> handleNotFound(ResourceNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
