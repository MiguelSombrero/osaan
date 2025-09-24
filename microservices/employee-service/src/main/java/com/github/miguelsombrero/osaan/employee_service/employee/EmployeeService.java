package com.github.miguelsombrero.osaan.employee_service.employee;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
class EmployeeService {

    private final EmployeeMapper mapper;
    private final EmployeeRepository repository;

    EmployeeService(EmployeeMapper mapper, EmployeeRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    public Employee getEmployeeById(UUID employeeId) {
        EmployeeEntity entity = repository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapper.entityToApi(entity);
    }

    public Employee saveEmployee(Employee employee) {
        EmployeeEntity entity = mapper.apiToEntity(employee);
        return mapper.entityToApi(repository.save(entity));
    }
}
