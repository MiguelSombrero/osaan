package com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    private UUID id;
    private String name;
}
