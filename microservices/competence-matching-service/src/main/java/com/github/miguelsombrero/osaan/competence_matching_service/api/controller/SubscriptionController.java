package com.github.miguelsombrero.osaan.competence_matching_service.api.controller;

import com.github.miguelsombrero.osaan.competence_matching_service.api.dto.CreateSubscriptionRequest;
import com.github.miguelsombrero.osaan.competence_matching_service.api.dto.SubscriptionDto;
import com.github.miguelsombrero.osaan.competence_matching_service.api.mapper.ApiDomainSubscriptionMapper;
import com.github.miguelsombrero.osaan.competence_matching_service.application.port.ManageSubscriptionsPort;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/v1/subscriptions")
@SecurityRequirement(name = "bearer")
@Tag(name = "Subscriptions", description = "REST API for skill subscriptions used in competence matching")
@ApiResponses(value = {
        @ApiResponse(responseCode = "400", description = "Bad Request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "403", description = "Forbidden"),
        @ApiResponse(responseCode = "404", description = "Not Found"),
        @ApiResponse(responseCode = "500", description = "Internal Server Error")
})
@RequiredArgsConstructor
public class SubscriptionController {

    private final ManageSubscriptionsPort manageSubscriptionsPort;
    private final ApiDomainSubscriptionMapper mapper;

    @GetMapping
    @ApiResponse(responseCode = "200", description = "OK")
    @Operation(summary = "List own subscriptions",
            description = "Returns the subscriptions owned by the authenticated user.")
    public List<SubscriptionDto> getSubscriptions(@AuthenticationPrincipal Jwt jwt) {
        return manageSubscriptionsPort.getSubscriptions(jwt.getSubject()).stream()
                .map(mapper::domainToApi)
                .toList();
    }

    @PostMapping
    @ApiResponse(responseCode = "201", description = "Created")
    @Operation(summary = "Create subscription",
            description = "Registers interest in a skill at a minimum rating. " +
                    "Owner and recipient email are derived from the authenticated user.")
    public ResponseEntity<SubscriptionDto> createSubscription(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody @Valid CreateSubscriptionRequest request
    ) {
        Subscription created = manageSubscriptionsPort.createSubscription(
                jwt.getSubject(),
                jwt.getClaimAsString("email"),
                request.skill(),
                request.rating()
        );
        SubscriptionDto dto = mapper.domainToApi(created);
        URI location = URI.create("/v1/subscriptions/" + dto.getId());
        return ResponseEntity.created(location).body(dto);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204", description = "No Content")
    @Operation(summary = "Delete subscription",
            description = "Deletes the authenticated user's subscription by ID.")
    public ResponseEntity<Void> deleteSubscription(
            @AuthenticationPrincipal Jwt jwt,
            @Parameter(in = ParameterIn.PATH, required = true, example = "c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8")
            @PathVariable UUID id
    ) {
        manageSubscriptionsPort.deleteSubscription(jwt.getSubject(), id);
        return ResponseEntity.noContent().build();
    }
}
