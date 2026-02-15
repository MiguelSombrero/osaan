package com.github.miguelsombrero.osaan.skill_catalog_service.api.mapper;

import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.SkillDto;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiDomainSkillMapper {

    SkillDto domainToApi(Skill domain);
}