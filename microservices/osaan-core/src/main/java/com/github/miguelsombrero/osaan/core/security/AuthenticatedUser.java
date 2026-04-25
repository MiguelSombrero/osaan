package com.github.miguelsombrero.osaan.core.security;

public record AuthenticatedUser(
        String keycloakId,
        String firstName,
        String lastName,
        String email
) {
}
