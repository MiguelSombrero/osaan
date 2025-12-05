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
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.client.RestTestClient;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("it")
@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(scripts = "/data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
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
    void getSkills_returnsFirstPageOnDefault() {
        GetSkillsResponse response = restTestClient.get()
                .uri("/v1/admin/skills")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull GetSkillsResponse>() {
                })
                .returnResult()
                .getResponseBody();

        List<Skill> skills = response.skills();

        // data.sql defines 85 skills, default page size is 20
        assertEquals(20, skills.size(), "expected default page size of 20");
        // Verify pagination metadata
        assertEquals(0, response.page(), "expected first page (0)");
        assertEquals(20, response.size(), "expected page size of 20");
        assertEquals(85, response.totalElements(), "expected 85 total skills from data.sql");
        assertEquals(5, response.totalPages(), "expected 5 pages (85 skills / 20 per page)");
        assertTrue(response.first(), "expected first page flag to be true");
        assertFalse(response.last(), "expected last page flag to be false");
    }

    @Test
    void getSkills_appliesDefaultSort_whenNoSortParameterProvided() {
        GetSkillsResponse response = restTestClient.get()
                .uri("/v1/admin/skills")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull GetSkillsResponse>() {
                })
                .returnResult()
                .getResponseBody();

        List<Skill> skills = response.skills();

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
        GetSkillsResponse response = restTestClient.get()
                .uri("/v1/admin/skills?sort=name,desc")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull GetSkillsResponse>() {
                })
                .returnResult()
                .getResponseBody();

        List<Skill> skills = response.skills();

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

        GetSkillsResponse response = restTestClient.get()
                .uri("/v1/admin/skills?size=100") // Get all skills
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull GetSkillsResponse>() {
                })
                .returnResult()
                .getResponseBody();

        List<Skill> skillsAfter = response.skills();

        assertTrue(skillsAfter.stream().noneMatch(s -> idToDelete.equals(s.getId())), "deleted skill should not be present");
        assertEquals(84, response.totalElements(), "expected 84 skills after deletion");
    }

    @Test
    void getSkills_withPagination_returnsCorrectPage() {
        // Get page 1 (second page) with size 10
        GetSkillsResponse response = restTestClient.get()
                .uri("/v1/admin/skills?page=1&size=10")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull GetSkillsResponse>() {
                })
                .returnResult()
                .getResponseBody();

        assertEquals(1, response.page(), "expected page 1");
        assertEquals(10, response.size(), "expected page size of 10");
        assertEquals(10, response.skills().size(), "expected 10 skills on this page");
        assertEquals(85, response.totalElements(), "expected 85 total skills");
        assertEquals(9, response.totalPages(), "expected 9 pages (85 skills / 10 per page)");
        assertFalse(response.first(), "expected not first page");
        assertFalse(response.last(), "expected not last page");
    }

    @Test
    void getSkills_withQuery_paginatesFilteredResults() {
        // Filter by 'test' and paginate
        GetSkillsResponse response = restTestClient.get()
                .uri("/v1/admin/skills?query=test&page=0&size=5")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull GetSkillsResponse>() {
                })
                .returnResult()
                .getResponseBody();

        // data.sql has: testng, pytest, testcontainers containing 'test'
        assertTrue(response.totalElements() >= 3, "expected at least 3 skills containing 'test'");
        assertTrue(response.skills().size() <= 5, "expected at most 5 skills per page");

        // All returned skills should contain 'test' in their name
        assertTrue(response.skills().stream()
                        .allMatch(s -> s.getName().toLowerCase().contains("test")),
                "all skills should contain 'test' in their name");
    }

    @Test
    void getSkills_emptyPage_returnsEmptyList() {
        // Request a page beyond available data
        GetSkillsResponse response = restTestClient.get()
                .uri("/v1/admin/skills?page=100&size=20")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<@NotNull GetSkillsResponse>() {
                })
                .returnResult()
                .getResponseBody();

        assertEquals(0, response.skills().size(), "expected empty skills list");
        assertEquals(100, response.page(), "expected page 100");
        assertEquals(85, response.totalElements(), "total elements should still be 85");
        assertFalse(response.first(), "should not be first page");
        assertTrue(response.last(), "should be considered last page when beyond data");
    }

}
