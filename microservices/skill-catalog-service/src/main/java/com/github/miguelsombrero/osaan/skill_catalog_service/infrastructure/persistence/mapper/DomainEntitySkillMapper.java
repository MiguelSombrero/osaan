package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.mapper;

import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.entity.SkillEntity;
import com.github.miguelsombrero.osaan.skill_catalog_service.skill.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface DomainEntitySkillMapper {

    Skill entityToDomain(SkillEntity entity);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "name", expression = "java(domain.getName().toLowerCase())")
    })
    SkillEntity domainToEntity(Skill domain);
}