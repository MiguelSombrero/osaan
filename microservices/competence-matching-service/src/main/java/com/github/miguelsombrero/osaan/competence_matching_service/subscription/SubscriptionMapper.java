package com.github.miguelsombrero.osaan.competence_matching_service.subscription;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
interface SubscriptionMapper {

    Subscription entityToApi(SubscriptionEntity entity);

    @Mappings({
            @Mapping(target = "id", ignore = true)
    })
    SubscriptionEntity apiToEntity(Subscription api);
}