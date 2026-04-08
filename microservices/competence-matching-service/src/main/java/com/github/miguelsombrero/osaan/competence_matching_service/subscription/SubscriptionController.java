package com.github.miguelsombrero.osaan.competence_matching_service.subscription;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

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
class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "List subscriptions", description = "Returns all stored skill subscriptions.")
    public List<Subscription> getSubscriptions() {
        return service.getSubscriptions();
    }

    @PostMapping
    @Operation(summary = "Create subscription", description = "Registers interest in a skill at a minimum rating for notification.")
    public Subscription subscribe(@RequestBody Subscription subscription) {
        return service.saveSubscription(subscription);
    }

}
