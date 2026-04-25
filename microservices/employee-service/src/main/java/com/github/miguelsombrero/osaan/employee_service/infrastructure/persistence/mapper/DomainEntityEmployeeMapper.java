package com.github.miguelsombrero.osaan.employee_service.infrastructure.persistence.mapper;

import com.github.miguelsombrero.osaan.employee_service.domain.entity.Employee;
import com.github.miguelsombrero.osaan.employee_service.infrastructure.persistence.entity.EmployeeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DomainEntityEmployeeMapper {

    Employee entityToDomain(EmployeeEntity entity);

    @Mapping(target = "id", ignore = true)
    EmployeeEntity domainToEntity(Employee domain);
}
