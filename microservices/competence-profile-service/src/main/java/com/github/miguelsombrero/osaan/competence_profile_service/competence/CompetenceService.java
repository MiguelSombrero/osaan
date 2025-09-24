package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import com.github.miguelsombrero.osaan.competence_profile_service.integration.CompetenceIntegration;
import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
class CompetenceService {

    private final CompetenceMapper mapper;
    private final CompetenceRepository repository;
    private final CompetenceIntegration integration;

    CompetenceService(
            CompetenceMapper mapper, CompetenceRepository repository, CompetenceIntegration integration
    ) {
        this.mapper = mapper;
        this.repository = repository;
        this.integration = integration;
    }

    public Competence saveCompetence(Competence competence) {
        if (integration.getEmployee(competence.getEmployeeId()).isEmpty()) {
            log.error("Employee with id {} does not exist", competence.getEmployeeId());
            throw new ResourceNotFoundException("Employee not found");
        }

        CompetenceEntity entity = mapper.apiToEntity(competence);
        return mapper.entityToApi(repository.save(entity));
    }
}
