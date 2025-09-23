package com.github.miguelsombrero.osaan.employee_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class EmployeeServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
