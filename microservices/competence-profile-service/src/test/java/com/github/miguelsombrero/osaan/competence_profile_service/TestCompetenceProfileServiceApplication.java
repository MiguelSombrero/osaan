package com.github.miguelsombrero.osaan.competence_profile_service;

import org.springframework.boot.SpringApplication;

public class TestCompetenceProfileServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(CompetenceProfileServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
