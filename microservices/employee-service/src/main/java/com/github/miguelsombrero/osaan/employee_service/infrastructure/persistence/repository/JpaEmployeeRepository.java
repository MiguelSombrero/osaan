package com.github.miguelsombrero.osaan.employee_service.infrastructure.persistence.repository;

import com.github.miguelsombrero.osaan.employee_service.infrastructure.persistence.entity.EmployeeEntity;
import org.springframework.data.repository.ListCrudRepository;

import java.util.Optional;
import java.util.UUID;

interface JpaEmployeeRepository extends ListCrudRepository<EmployeeEntity, UUID> {
    Optional<EmployeeEntity> findByKeycloakId(String keycloakId);
}
