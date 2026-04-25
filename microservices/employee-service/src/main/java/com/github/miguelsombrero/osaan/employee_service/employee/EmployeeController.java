package com.github.miguelsombrero.osaan.employee_service.employee;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/employees")
@Tag(name = "Employee", description = "REST API for operations on employees")
class EmployeeController {

    protected final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @Operation(
            summary = "Create Employee",
            description = "Creates new employee and returns created employee with generated ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee savedEmployee = service.saveEmployee(employee);
        URI location = URI.create("/v1/employees/" + savedEmployee.getId());
        return ResponseEntity.created(location).body(savedEmployee);
    }

    @Operation(
            summary = "Get Employees",
            description = "Get employees by their IDs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @GetMapping
    public List<Employee> getEmployees(@RequestParam List<UUID> employeeIds) {
        return service.getEmployees(employeeIds);
    }

    @Operation(
            summary = "Get Employee",
            description = "Get employee by Keycloak ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Bad Request"),
            @ApiResponse(responseCode = "404", description = "Not Found"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    @GetMapping("/{keycloakId}")
    public Employee getEmployee(@PathVariable String keycloakId) {
        return service.getEmployeeByKeycloakId(keycloakId);
    }

}
