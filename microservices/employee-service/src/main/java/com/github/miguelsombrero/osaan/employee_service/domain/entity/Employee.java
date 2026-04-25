package com.github.miguelsombrero.osaan.employee_service.domain.entity;

import java.util.UUID;

public record Employee(UUID id, String firstName, String lastName, String email, String keycloakId) {
}
