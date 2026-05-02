package com.github.miguelsombrero.osaan.competence_profile_service.competence;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CompetenceControllerTest {

    private static final UUID SKILL_ID = UUID.fromString("bbbbbbbb-0000-0000-0000-000000000001");

    private static final EmployeeSearchResult SEARCH_RESULT = new EmployeeSearchResult(
            UUID.fromString("aaaaaaaa-0000-0000-0000-000000000001"),
            "John", "Doe", "john@example.com",
            List.of(new EmployeeSearchResult.MatchedSkill(SKILL_ID, "Java", 3))
    );

    @Mock
    private CompetenceService service;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        CompetenceController controller = new CompetenceController(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void search_withSkillNameAndRating_returns200WithMatchedSkillAndRating() throws Exception {
        when(service.searchBySkillAndRating("Java", Optional.of(3))).thenReturn(List.of(SEARCH_RESULT));

        mockMvc.perform(get("/v1/competences/search")
                        .param("skillName", "Java")
                        .param("rating", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[0].lastName").value("Doe"))
                .andExpect(jsonPath("$[0].email").value("john@example.com"))
                .andExpect(jsonPath("$[0].matchedSkills[0].skillName").value("Java"))
                .andExpect(jsonPath("$[0].matchedSkills[0].rating").value(3));

        verify(service).searchBySkillAndRating(eq("Java"), eq(Optional.of(3)));
    }

    @Test
    void search_withSkillNameOnly_delegatesEmptyRatingToService() throws Exception {
        when(service.searchBySkillAndRating("Python", Optional.empty())).thenReturn(List.of(SEARCH_RESULT));

        mockMvc.perform(get("/v1/competences/search").param("skillName", "Python"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[0].matchedSkills[0].skillName").value("Java"))
                .andExpect(jsonPath("$[0].matchedSkills[0].rating").value(3));

        verify(service).searchBySkillAndRating(eq("Python"), eq(Optional.empty()));
    }

    @Test
    void search_withNoParams_returns200WithEmptyList() throws Exception {
        when(service.searchBySkillAndRating(null, Optional.empty())).thenReturn(List.of());

        mockMvc.perform(get("/v1/competences/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}
