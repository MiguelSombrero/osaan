package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Data
@Table("competences")
@NoArgsConstructor
@AllArgsConstructor
class CompetenceEntity {
    @Id
    private UUID id;
    private UUID employeeId;
    private UUID skillId;
    private int rating;
}
