package com.github.miguelsombrero.osaan.employee_service.employee;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    Employee entityToApi(EmployeeEntity entity);

    @Mappings({
            @Mapping(target = "id", ignore = true)
    })
    EmployeeEntity apiToEntity(Employee api);
}