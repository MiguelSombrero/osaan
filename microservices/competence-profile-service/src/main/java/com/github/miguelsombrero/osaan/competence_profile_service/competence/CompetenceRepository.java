package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import org.springframework.data.repository.ListCrudRepository;

import java.util.List;
import java.util.UUID;

interface CompetenceRepository extends ListCrudRepository<CompetenceEntity, UUID> {
    List<Competence> findBySkillId(UUID skillId);

    List<Competence> findBySkillIdAndRatingGreaterThanEqual(UUID skillId, int rating);
}
