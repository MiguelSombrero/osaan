package com.github.miguelsombrero.osaan.competence_matching_service;

import org.springframework.boot.SpringApplication;

public class TestCompetenceMatchingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(CompetenceMatchingServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
