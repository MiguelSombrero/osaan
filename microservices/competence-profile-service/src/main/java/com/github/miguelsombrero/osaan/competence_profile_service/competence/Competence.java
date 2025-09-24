package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
class Competence {
    private UUID id;
    private UUID employeeId;
    private UUID skillId;
    private int rating;
}
