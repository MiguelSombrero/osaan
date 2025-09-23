package com.github.miguelsombrero.osaan.employee_service.employee;

import org.springframework.stereotype.Service;

@Service
class EmployeeService {

    private final EmployeeMapper mapper;
    private final EmployeeRepository repository;

    EmployeeService(EmployeeMapper mapper, EmployeeRepository repository) {
        this.mapper = mapper;
        this.repository = repository;
    }

    public Employee getEmployee(String email) {
        EmployeeEntity entity = repository.findByEmail(email).orElse(new EmployeeEntity());
        return mapper.entityToApi(entity);
    }

    public Employee saveEmployee(Employee employee) {
        EmployeeEntity entity = mapper.apiToEntity(employee);
        return mapper.entityToApi(repository.save(entity));
    }
}
