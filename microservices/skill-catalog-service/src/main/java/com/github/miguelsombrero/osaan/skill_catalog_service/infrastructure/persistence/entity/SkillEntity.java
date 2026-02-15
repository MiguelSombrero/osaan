package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Data
@Table("skills")
@NoArgsConstructor
@AllArgsConstructor
public class SkillEntity {
    @Id
    private UUID id;
    private String name;
}
