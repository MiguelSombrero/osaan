package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.mapper;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.entity.SkillEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DomainEntitySkillMapper {

    Skill entityToDomain(SkillEntity entity);

    SkillEntity domainToEntity(Skill domain);
}