package com.github.miguelsombrero.osaan.employee_service.employee;

import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{email}")
    public Employee getEmployee(@PathVariable String email) {
        return service.getEmployee(email);
    }

}
