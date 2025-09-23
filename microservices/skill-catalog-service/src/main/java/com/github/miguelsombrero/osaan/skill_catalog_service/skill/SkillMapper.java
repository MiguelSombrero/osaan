package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
interface SkillMapper {

    Skill entityToApi(SkillEntity entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "name", expression = "java(api.getName().toLowerCase())")
    })
    SkillEntity apiToEntity(Skill api);
}