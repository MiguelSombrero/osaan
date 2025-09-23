package com.github.miguelsombrero.osaan.employee_service.employee;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
}
