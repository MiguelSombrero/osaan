package com.github.miguelsombrero.osaan.employee_service.domain.repository;

import com.github.miguelsombrero.osaan.employee_service.domain.entity.Employee;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository {
    List<Employee> findAllById(List<UUID> ids);
    Optional<Employee> findByKeycloakId(String keycloakId);
    Employee save(Employee employee);
}
