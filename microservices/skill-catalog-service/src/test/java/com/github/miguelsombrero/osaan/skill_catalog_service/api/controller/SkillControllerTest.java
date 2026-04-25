package com.github.miguelsombrero.osaan.skill_catalog_service.api.controller;

import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import com.github.miguelsombrero.osaan.skill_catalog_service.api.dto.SkillDto;
import com.github.miguelsombrero.osaan.skill_catalog_service.api.mapper.ApiDomainSkillMapper;
import com.github.miguelsombrero.osaan.skill_catalog_service.application.port.ManageSkillsPort;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SkillControllerTest {

    private static final UUID SKILL_ID = UUID.fromString("a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5");
    private static final Skill JAVA_SKILL = new Skill(SKILL_ID, "java");
    private static final SkillDto JAVA_SKILL_DTO = new SkillDto(SKILL_ID, "java");

    @Mock
    private ManageSkillsPort manageSkillsPort;

    @Mock
    private ApiDomainSkillMapper apiMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        SkillController controller = new SkillController(manageSkillsPort, apiMapper);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .setControllerAdvice(new ResourceNotFoundExceptionHandler())
                .build();
    }

    @Test
    void getSkills_noQuery_returns200WithPaginatedResponse() throws Exception {
        // Use a page size of 1 equal to content size so PageImpl does not adjust total
        PageImpl<Skill> page = new PageImpl<>(List.of(JAVA_SKILL), PageRequest.of(0, 1), 1);
        when(manageSkillsPort.getSkills(eq(null), any())).thenReturn(page);
        when(apiMapper.domainToApi(JAVA_SKILL)).thenReturn(JAVA_SKILL_DTO);

        mockMvc.perform(get("/v1/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills[0].id").value(SKILL_ID.toString()))
                .andExpect(jsonPath("$.skills[0].name").value("java"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.first").value(true));
    }

    @Test
    void getSkills_withQuery_passesQueryToPortAndReturnsFilteredResults() throws Exception {
        PageImpl<Skill> page = new PageImpl<>(List.of(JAVA_SKILL), Pageable.ofSize(20), 1);
        when(manageSkillsPort.getSkills(eq("java"), any())).thenReturn(page);
        when(apiMapper.domainToApi(JAVA_SKILL)).thenReturn(JAVA_SKILL_DTO);

        mockMvc.perform(get("/v1/skills").param("query", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills[0].name").value("java"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(manageSkillsPort).getSkills(eq("java"), any());
    }

    @Test
    void getSkills_emptyPage_returnsEmptySkillsListWithZeroTotals() throws Exception {
        PageImpl<Skill> emptyPage = new PageImpl<>(List.of(), Pageable.ofSize(20), 0);
        when(manageSkillsPort.getSkills(any(), any())).thenReturn(emptyPage);

        mockMvc.perform(get("/v1/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills").isEmpty())
                .andExpect(jsonPath("$.totalElements").value(0))
                .andExpect(jsonPath("$.totalPages").value(0));
    }

    @Test
    void getSkills_paginationMetadataReflectsPageState() throws Exception {
        // Page 1 of 3: size=3, content has 3 items, total=9.
        // offset(3) + pageSize(3) = 6, not > total(9) — so PageImpl preserves total unchanged.
        Skill skill2 = new Skill(UUID.randomUUID(), "python");
        Skill skill3 = new Skill(UUID.randomUUID(), "typescript");
        SkillDto dto2 = new SkillDto(skill2.id(), "python");
        SkillDto dto3 = new SkillDto(skill3.id(), "typescript");
        PageImpl<Skill> page = new PageImpl<>(
                List.of(JAVA_SKILL, skill2, skill3),
                PageRequest.of(1, 3),
                9
        );
        when(manageSkillsPort.getSkills(any(), any())).thenReturn(page);
        when(apiMapper.domainToApi(JAVA_SKILL)).thenReturn(JAVA_SKILL_DTO);
        when(apiMapper.domainToApi(skill2)).thenReturn(dto2);
        when(apiMapper.domainToApi(skill3)).thenReturn(dto3);

        mockMvc.perform(get("/v1/skills").param("page", "1").param("size", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.size").value(3))
                .andExpect(jsonPath("$.totalElements").value(9))
                .andExpect(jsonPath("$.first").value(false))
                .andExpect(jsonPath("$.last").value(false));
    }

    @Test
    void getSkill_existingId_returns200WithSkillData() throws Exception {
        when(manageSkillsPort.getSkill(SKILL_ID)).thenReturn(JAVA_SKILL);
        when(apiMapper.domainToApi(JAVA_SKILL)).thenReturn(JAVA_SKILL_DTO);

        mockMvc.perform(get("/v1/skills/{skillId}", SKILL_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(SKILL_ID.toString()))
                .andExpect(jsonPath("$.name").value("java"));
    }

    @Test
    void getSkill_nonExistingId_returns404() throws Exception {
        when(manageSkillsPort.getSkill(SKILL_ID)).thenThrow(new ResourceNotFoundException("Skill not found"));

        mockMvc.perform(get("/v1/skills/{skillId}", SKILL_ID))
                .andExpect(status().isNotFound());
    }

    @Test
    void getSkill_invalidUuidPathVariable_returns400() throws Exception {
        mockMvc.perform(get("/v1/skills/not-a-valid-uuid"))
                .andExpect(status().isBadRequest());
    }

    @RestControllerAdvice
    static class ResourceNotFoundExceptionHandler {
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<Void> handleNotFound(ResourceNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
