package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Response wrapper containing a list of skills", name = "GetSkillsResponse")
public record GetSkillsResponse(
        @ArraySchema(schema = @Schema(implementation = Skill.class, description = "List of skills"), minItems = 0)
        List<Skill> skills) {
}
