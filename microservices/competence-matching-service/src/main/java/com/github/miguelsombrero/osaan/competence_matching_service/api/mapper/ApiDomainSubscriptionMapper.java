package com.github.miguelsombrero.osaan.competence_matching_service.api.mapper;

import com.github.miguelsombrero.osaan.competence_matching_service.api.dto.SubscriptionDto;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiDomainSubscriptionMapper {

    SubscriptionDto domainToApi(Subscription domain);
}
