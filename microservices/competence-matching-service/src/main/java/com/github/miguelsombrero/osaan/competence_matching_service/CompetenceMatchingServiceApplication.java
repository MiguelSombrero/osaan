package com.github.miguelsombrero.osaan.competence_matching_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.github.miguelsombrero.osaan")
public class CompetenceMatchingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompetenceMatchingServiceApplication.class, args);
    }

}
