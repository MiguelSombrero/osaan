package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.UUID;

@Mapper(componentModel = "spring")
interface CompetenceMapper {

    Competence entityToApi(CompetenceEntity entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "employeeId", source = "employeeId")
    })
    CompetenceEntity apiToEntity(Competence api, UUID employeeId);
}