package com.github.miguelsombrero.osaan.employee_service.employee;

import org.springframework.data.repository.ListCrudRepository;

import java.util.Optional;
import java.util.UUID;

interface EmployeeRepository extends ListCrudRepository<EmployeeEntity, UUID> {

    Optional<EmployeeEntity> findByKeycloakId(String keycloakId);
}
