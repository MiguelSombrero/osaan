package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("subscriptions")
public class SubscriptionEntity {
    @Id
    private UUID id;
    private String userId;
    private String email;
    private String skill;
    private int rating;
    private Instant createdAt;
}
