package com.github.miguelsombrero.osaan.core.event;

public record SkillCreatedEvent(String skill, int rating, String firstName, String lastName, String email) {
}
