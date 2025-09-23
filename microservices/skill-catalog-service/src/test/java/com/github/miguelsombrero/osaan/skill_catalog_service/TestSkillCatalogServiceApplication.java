package com.github.miguelsombrero.osaan.skill_catalog_service;

import org.springframework.boot.SpringApplication;

public class TestSkillCatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(SkillCatalogServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
