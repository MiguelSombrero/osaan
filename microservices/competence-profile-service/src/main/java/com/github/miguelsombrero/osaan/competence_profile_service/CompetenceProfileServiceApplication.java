package com.github.miguelsombrero.osaan.competence_profile_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = "com.github.miguelsombrero.osaan")
@SpringBootApplication
public class CompetenceProfileServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompetenceProfileServiceApplication.class, args);
    }

}
