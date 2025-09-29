package com.github.miguelsombrero.osaan.employee_service.employee;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return service.saveEmployee(employee);
    }

    @GetMapping
    public List<Employee> getEmployees(@RequestParam List<UUID> employeeIds) {
        return service.getEmployees(employeeIds);
    }

    @GetMapping("/{employeeId}")
    public Employee getEmployee(@PathVariable UUID employeeId) {
        return service.getEmployeeById(employeeId);
    }

}
