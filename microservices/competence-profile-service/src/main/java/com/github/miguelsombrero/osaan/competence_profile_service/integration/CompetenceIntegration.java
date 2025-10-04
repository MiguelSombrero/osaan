package com.github.miguelsombrero.osaan.competence_profile_service.integration;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
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

    public Skill findSkillById(UUID skillId) {
        return client.get()
                .uri(skillCatalogServiceUrl + "/v1/skills/{skillId}", skillId)
                .retrieve()
                .body(Skill.class);
    }

    public Skill findSkillByName(String name) {
        String url = UriComponentsBuilder
                .fromUriString(skillCatalogServiceUrl + "/v1/skills")
                .queryParam("name", name)
                .toUriString();

        return client.get()
                .uri(url)
                .retrieve()
                .body(Skill.class);
    }

    @Retry(name = "competence")
    @CircuitBreaker(name = "competence", fallbackMethod = "getEmployeesFallbackValue")
    public List<Employee> getEmployees(List<UUID> employeeIds) {
        String url = UriComponentsBuilder
                .fromUriString(employeeServiceUrl + "/v1/employees")
                .queryParam("employeeIds", employeeIds.toArray())
                .toUriString();

        return client.get().uri(url)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }

    private List<Employee> getEmployeesFallbackValue(List<UUID> employeeIds, CallNotPermittedException ex) {
        log.info("Error fetching employees with ids {}: {}", employeeIds, ex.getMessage());
        return List.of();
    }
}
