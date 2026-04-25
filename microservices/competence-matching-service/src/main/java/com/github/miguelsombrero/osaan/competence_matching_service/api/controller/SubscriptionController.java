package com.github.miguelsombrero.osaan.competence_matching_service.api.controller;

import com.github.miguelsombrero.osaan.competence_matching_service.api.dto.SubscriptionDto;
import com.github.miguelsombrero.osaan.competence_matching_service.api.mapper.ApiDomainSubscriptionMapper;
import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ManageSubscriptionsPort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/v1/subscriptions")
@SecurityRequirement(name = "bearer")
@ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "OK"),
        @ApiResponse(responseCode = "400", description = "Bad Request"),
        @ApiResponse(responseCode = "500", description = "Internal Server Error")
})
@Tag(name = "Subscriptions", description = "REST API for skill subscriptions used in competence matching")
@RequiredArgsConstructor
public class SubscriptionController {

    private final ManageSubscriptionsPort manageSubscriptionsPort;
    private final ApiDomainSubscriptionMapper mapper;

    @GetMapping
    @Operation(summary = "List subscriptions", description = "Returns all stored skill subscriptions.")
    public List<SubscriptionDto> getSubscriptions() {
        return manageSubscriptionsPort.getSubscriptions().stream()
                .map(mapper::domainToApi)
                .toList();
    }

    @PostMapping
    @Operation(summary = "Create subscription", description = "Registers interest in a skill at a minimum rating for notification.")
    public SubscriptionDto subscribe(@RequestBody SubscriptionDto dto) {
        return mapper.domainToApi(manageSubscriptionsPort.saveSubscription(mapper.apiToDomain(dto)));
    }
}
