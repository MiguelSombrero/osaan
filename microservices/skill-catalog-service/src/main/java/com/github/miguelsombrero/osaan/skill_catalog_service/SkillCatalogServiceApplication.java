package com.github.miguelsombrero.osaan.skill_catalog_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.github.miguelsombrero.osaan")
public class SkillCatalogServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillCatalogServiceApplication.class, args);
	}

}
