package com.github.miguelsombrero.osaan.employee_service.application.service;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import com.github.miguelsombrero.osaan.employee_service.application.port.ManageEmployeesPort;
import com.github.miguelsombrero.osaan.employee_service.domain.entity.Employee;
import com.github.miguelsombrero.osaan.employee_service.domain.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ManageEmployeesService implements ManageEmployeesPort {

    private final EmployeeRepository repository;

    public ManageEmployeesService(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Employee> getEmployees(List<UUID> employeeIds) {
        return repository.findAllById(employeeIds);
    }

    @Override
    public Employee getEmployeeByKeycloakId(String keycloakId) {
        return repository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
    }

    @Override
    public Employee saveEmployee(Employee employee) {
        return repository.save(employee);
    }
}
