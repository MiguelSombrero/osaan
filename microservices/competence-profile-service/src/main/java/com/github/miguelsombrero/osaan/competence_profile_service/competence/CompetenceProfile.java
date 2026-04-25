package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.integration.Employee;

import java.util.List;

public record CompetenceProfile(
        Employee employee,
        List<CompetenceDetail> competences
) {
}
