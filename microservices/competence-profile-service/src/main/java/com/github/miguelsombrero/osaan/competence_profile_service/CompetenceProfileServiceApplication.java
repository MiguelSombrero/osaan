package com.github.miguelsombrero.osaan.competence_profile_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.resilience.annotation.EnableResilientMethods;

@SpringBootApplication
@EnableResilientMethods
@ComponentScan(basePackages = "com.github.miguelsombrero.osaan")
public class CompetenceProfileServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompetenceProfileServiceApplication.class, args);
    }

}
