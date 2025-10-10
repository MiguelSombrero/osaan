package com.github.miguelsombrero.osaan.employee_service.employee;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@Slf4j
@RestController
@RequestMapping("/v1/admin/employees")
@Tag(name = "AdminEmployee", description = "REST API for admin operations on employees")
class AdminEmployeeController {

    protected final EmployeeService service;

    public AdminEmployeeController(EmployeeService service) {
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
        URI location = URI.create("/v1/admin/employees/" + savedEmployee.getId());
        return ResponseEntity.created(location).body(savedEmployee);
    }
}
