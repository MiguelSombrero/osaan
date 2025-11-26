package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.UUID;

import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;

import com.github.miguelsombrero.osaan.skill_catalog_service.TestcontainersConfiguration;

@ActiveProfiles("it")
@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AdminSkillControllerIT {

    RestTestClient restTestClient;

    @LocalServerPort
    int port;

    @BeforeEach
    void setUp() {
        restTestClient = RestTestClient.bindToServer()
                .baseUrl("http://localhost:" + port)
                .build();
    }

    @Test
    void getSkills_returnsAllSkills() {
        List<Skill> skills = restTestClient.get()
                .uri("/v1/admin/skills")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull List<Skill>>() {
                })
                .returnResult()
                .getResponseBody();

        // data.sql defines at least 8 skills
        assertTrue(skills.size() >= 8, "expected at least 8 skills from data.sql");
        assertTrue(skills.stream().anyMatch(s -> "java".equalsIgnoreCase(s.getName())), "expected 'java' skill");
    }

    @Test
    void createSkill_returnsCreatedSkill() {
        Skill toCreate = new Skill(null, "integration-test-skill");

        Skill created = restTestClient.post()
                .uri("/v1/admin/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .body(toCreate)
                .exchange()
                .expectStatus().isCreated()
                .expectBody(Skill.class)
                .returnResult()
                .getResponseBody();

        assertNotNull(created);
        assertNotNull(created.getId(), "created skill should have an id");
        assertEquals("integration-test-skill", created.getName());
    }

    @Test
    void deleteSkill_returnsNoContent() {
        UUID idToDelete = UUID.fromString("c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8"); // javascript from data.sql

        restTestClient.delete()
                .uri("/v1/admin/skills/{id}", idToDelete)
                .exchange()
                .expectStatus().isNoContent();

        List<Skill> skillsAfter = restTestClient.get()
                .uri("/v1/admin/skills")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull List<Skill>>() {
                })
                .returnResult()
                .getResponseBody();

        assertTrue(skillsAfter.stream().noneMatch(s -> idToDelete.equals(s.getId())), "deleted skill should not be present");
    }

}
