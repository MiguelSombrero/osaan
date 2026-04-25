package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.mapper;

import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.entity.SubscriptionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DomainEntitySubscriptionMapper {

    Subscription entityToDomain(SubscriptionEntity entity);

    SubscriptionEntity domainToEntity(Subscription domain);
}
