package com.github.miguelsombrero.osaan.employee_service.employee;

import org.springframework.data.repository.ListCrudRepository;

import java.util.UUID;

interface EmployeeRepository extends ListCrudRepository<EmployeeEntity, UUID> {
}
