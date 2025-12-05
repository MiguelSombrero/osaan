package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Paginated response containing skills and pagination metadata", name = "GetSkillsResponse")
public record GetSkillsResponse(
        @ArraySchema(schema = @Schema(implementation = Skill.class, description = "List of skills"), minItems = 0)
        List<Skill> skills,
        
        @Schema(description = "Current page number (zero-based)", example = "0")
        int page,
        
        @Schema(description = "Number of items per page", example = "20")
        int size,
        
        @Schema(description = "Total number of items", example = "100")
        long totalElements,
        
        @Schema(description = "Total number of pages", example = "5")
        int totalPages,
        
        @Schema(description = "Whether this is the first page", example = "true")
        boolean first,
        
        @Schema(description = "Whether this is the last page", example = "false")
        boolean last
) {
}
