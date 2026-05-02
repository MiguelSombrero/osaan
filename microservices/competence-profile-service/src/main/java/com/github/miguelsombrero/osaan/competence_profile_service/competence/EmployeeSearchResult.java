package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import java.util.List;
import java.util.UUID;

record EmployeeSearchResult(
        UUID id,
        String firstName,
        String lastName,
        String email,
        List<MatchedSkill> matchedSkills
) {
    record MatchedSkill(UUID skillId, String skillName, int rating) {}
}
