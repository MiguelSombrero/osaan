package com.github.miguelsombrero.osaan.competence_matching_service.subscription;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/v1/subscriptions")
class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Subscription> getSubscriptions() {
        return service.getSubscriptions();
    }

    @PostMapping
    public Subscription subscribe(@RequestBody Subscription subscription) {
        return service.saveSubscription(subscription);
    }

}
