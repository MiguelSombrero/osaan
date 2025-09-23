package com.github.miguelsombrero.osaan.employee_service;

import org.springframework.boot.SpringApplication;

public class TestEmployeeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(EmployeeServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
