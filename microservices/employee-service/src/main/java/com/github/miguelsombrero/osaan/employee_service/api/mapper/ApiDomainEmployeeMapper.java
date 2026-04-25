package com.github.miguelsombrero.osaan.employee_service.api.mapper;

import com.github.miguelsombrero.osaan.employee_service.api.dto.EmployeeDto;
import com.github.miguelsombrero.osaan.employee_service.domain.entity.Employee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ApiDomainEmployeeMapper {
    EmployeeDto domainToApi(Employee domain);
    Employee apiToDomain(EmployeeDto dto);
}
