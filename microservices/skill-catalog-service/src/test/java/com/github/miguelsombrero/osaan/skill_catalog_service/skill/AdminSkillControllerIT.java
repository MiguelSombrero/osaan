package com.github.miguelsombrero.osaan.skill_catalog_service.skill;

import com.github.miguelsombrero.osaan.skill_catalog_service.TestcontainersConfiguration;
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

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

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
    void getSkills_appliesDefaultSort_whenNoSortParameterProvided() {
        List<Skill> skills = restTestClient.get()
                .uri("/v1/admin/skills")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull List<Skill>>() {
                })
                .returnResult()
                .getResponseBody();

        List<String> names = skills.stream()
                .map(s -> s.getName().toLowerCase())
                .toList();

        boolean sortedAsc = true;
        for (int i = 0; i < names.size() - 1; i++) {
            if (names.get(i).compareTo(names.get(i + 1)) > 0) {
                sortedAsc = false;
                break;
            }
        }

        assertTrue(sortedAsc, "expected skills to be sorted ascending by name by default");
    }

    @Test
    void getSkills_sortByNameDesc_appliesDescendingOrder() {
        List<Skill> skills = restTestClient.get()
                .uri("/v1/admin/skills?sort=name,desc")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull List<Skill>>() {
                })
                .returnResult()
                .getResponseBody();

        List<String> names = skills.stream()
                .map(s -> s.getName().toLowerCase())
                .toList();

        boolean sortedDesc = true;
        for (int i = 0; i < names.size() - 1; i++) {
            if (names.get(i).compareTo(names.get(i + 1)) < 0) {
                sortedDesc = false;
                break;
            }
        }

        assertTrue(sortedDesc, "expected skills to be sorted descending by name when sort=name,desc is provided");
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
