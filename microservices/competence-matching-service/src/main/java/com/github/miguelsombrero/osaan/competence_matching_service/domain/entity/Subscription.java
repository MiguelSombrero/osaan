package com.github.miguelsombrero.osaan.competence_matching_service.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    private UUID id;
    private String userId;
    private String email;
    private String skill;
    private int rating;
    private Instant createdAt;
}
