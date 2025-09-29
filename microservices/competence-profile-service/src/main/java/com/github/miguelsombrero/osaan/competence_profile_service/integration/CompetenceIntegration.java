package com.github.miguelsombrero.osaan.competence_profile_service.integration;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.resilience.annotation.Retryable;
import org.springframework.retry.annotation.Recover;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
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

    @Retryable(
            includes = {HttpServerErrorException.class, ResourceAccessException.class, RestClientException.class},
            maxAttempts = 3,
            delay = 1000,
            multiplier = 2)
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

    //TODO: Not yet working?
//    @CircuitBreaker(
//            retryFor = {HttpServerErrorException.class, ResourceAccessException.class, RestClientException.class},
//            maxAttempts = 3,
//            openTimeout = 5000,
//            resetTimeout = 10000,
//            recover = "getEmployeesFallbackValue")
    @Retryable(
            includes = {HttpServerErrorException.class, ResourceAccessException.class, RestClientException.class},
            maxAttempts = 3,
            delay = 1000,
            multiplier = 2)
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

    @Recover
    private List<Employee> getEmployeesFallbackValue(RestClientException ex, List<UUID> employeeIds) {
        log.error("Error fetching employees with ids {}: {}", employeeIds, ex.getMessage());
        return List.of();
    }

}
