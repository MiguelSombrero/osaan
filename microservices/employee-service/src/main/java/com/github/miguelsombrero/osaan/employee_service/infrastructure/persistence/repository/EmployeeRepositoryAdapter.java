package com.github.miguelsombrero.osaan.employee_service.infrastructure.persistence.repository;

import com.github.miguelsombrero.osaan.employee_service.domain.entity.Employee;
import com.github.miguelsombrero.osaan.employee_service.domain.repository.EmployeeRepository;
import com.github.miguelsombrero.osaan.employee_service.infrastructure.persistence.mapper.DomainEntityEmployeeMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class EmployeeRepositoryAdapter implements EmployeeRepository {

    private final JpaEmployeeRepository repository;
    private final DomainEntityEmployeeMapper mapper;

    public EmployeeRepositoryAdapter(JpaEmployeeRepository repository, DomainEntityEmployeeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<Employee> findAllById(List<UUID> ids) {
        return repository.findAllById(ids).stream()
                .map(mapper::entityToDomain)
                .toList();
    }

    @Override
    public Optional<Employee> findByKeycloakId(String keycloakId) {
        return repository.findByKeycloakId(keycloakId).map(mapper::entityToDomain);
    }

    @Override
    public Employee save(Employee employee) {
        return mapper.entityToDomain(repository.save(mapper.domainToEntity(employee)));
    }
}
