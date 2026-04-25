package com.github.miguelsombrero.osaan.competence_matching_service.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Subscription to a skill and rating threshold for matching notifications")
public class SubscriptionDto {
    @Schema(description = "Unique subscription identifier", example = "c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8")
    private UUID id;
    @Schema(description = "Email address for notifications", example = "anna.korhonen@example.com")
    private String email;
    @Schema(description = "Skill name or keyword", example = "python")
    private String skill;
    @Schema(description = "Minimum competence rating (integer)", example = "3")
    private int rating;
}
