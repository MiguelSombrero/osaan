package com.github.miguelsombrero.osaan.employee_service.application.port;

import com.github.miguelsombrero.osaan.employee_service.domain.entity.Employee;

import java.util.List;
import java.util.UUID;

public interface ManageEmployeesPort {
    List<Employee> getEmployees(List<UUID> employeeIds);
    Employee getEmployeeByKeycloakId(String keycloakId);
    Employee saveEmployee(Employee employee);
}
