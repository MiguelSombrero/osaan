package com.github.miguelsombrero.osaan.competence_matching_service.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Payload for creating a subscription")
public record CreateSubscriptionRequest(
        @Schema(description = "Skill name to watch", example = "python")
        @NotBlank
        String skill,

        @Schema(description = "Minimum competence rating (1-5)", example = "3")
        @Min(1) @Max(5)
        int rating
) {
}
