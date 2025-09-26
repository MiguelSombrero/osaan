package com.github.miguelsombrero.osaan.competence_profile_service.integration;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
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
    private final String skillCatalogServiceUrl;

    private final RestClient client;

    CompetenceIntegration(
            @Value("${employee.service.url}") String employeeServiceUrl,
            @Value("${skill.service.url}") String skillCatalogServiceUrl,
            RestClient.Builder clientBuilder) {
        this.employeeServiceUrl = employeeServiceUrl;
        this.skillCatalogServiceUrl = skillCatalogServiceUrl;
        this.client = clientBuilder.build();
    }

    public Optional<Employee> getEmployee(UUID employeeId) {
        try {
            Employee employee = client.get()
                    .uri(employeeServiceUrl + "/v1/employees/{employeeId}", employeeId)
                    .retrieve()
                    .body(Employee.class);

            return Optional.ofNullable(employee);
        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty();
        }
    }

    public Skill findSkillByName(String name) {
        try {
            return client.get()
                    .uri(skillCatalogServiceUrl + "/v1/skills/{name}", name)
                    .retrieve()
                    .body(Skill.class);
        } catch (HttpClientErrorException.NotFound e) {
            log.error("Skill with name {} does not exist", name);
            throw new ResourceNotFoundException("Skill not found");
        }
    }
}
