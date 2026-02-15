package com.github.miguelsombrero.osaan.skill_catalog_service.api.mapper;

import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.SkillDto;
import com.github.miguelsombrero.osaan.skill_catalog_service.skill.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ApiDomainSkillMapper {

    SkillDto domainToApi(Skill domain);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "name", expression = "java(api.getName().toLowerCase())")
    })
    Skill apiToDomain(SkillDto api);
}