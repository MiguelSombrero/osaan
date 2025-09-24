package com.github.miguelsombrero.osaan.competence_profile_service.integration;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class CompetenceIntegration {

    private final String employeeServiceUrl;

    private final RestClient employeeClient;

    CompetenceIntegration(@Value("${employee.service.url}") String employeeServiceUrl, RestClient.Builder clientBuilder) {
        this.employeeServiceUrl = employeeServiceUrl;
        this.employeeClient = clientBuilder.build();
    }

    public Optional<Employee> getEmployee(UUID employeeId) {
        try {
            Employee employee = employeeClient.get()
                    .uri(employeeServiceUrl + "/v1/employees/{employeeId}", employeeId)
                    .retrieve()
                    .body(Employee.class);

            return Optional.ofNullable(employee);
        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty();
        }
    }
}
