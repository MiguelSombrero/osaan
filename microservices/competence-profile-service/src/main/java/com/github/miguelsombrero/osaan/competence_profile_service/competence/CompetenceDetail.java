package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import java.util.UUID;

public record CompetenceDetail(
        UUID id,
        String skillName,
        int rating
) {
}
