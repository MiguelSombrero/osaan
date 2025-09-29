package com.github.miguelsombrero.osaan.competence_matching_service.subscription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
class Subscription {
    private UUID id;
    private String email;
    private String skill;
    private int rating;
}
