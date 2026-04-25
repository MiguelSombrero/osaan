package com.github.miguelsombrero.osaan.skill_catalog_service.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.UUID;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AdminSkillControllerTest {

    private static final UUID SKILL_ID = UUID.fromString("a3f8c2de-4b19-4f7d-9c72-6a0f4b1d93c5");
    private static final Skill JAVA_SKILL = new Skill(SKILL_ID, "java");
    private static final SkillDto JAVA_SKILL_DTO = new SkillDto(SKILL_ID, "java");

    @Mock
    private ManageSkillsPort manageSkillsPort;

    @Mock
    private ApiDomainSkillMapper apiMapper;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        AdminSkillController controller = new AdminSkillController(manageSkillsPort, apiMapper);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new ResourceNotFoundExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void createSkill_validName_returns201WithLocationHeaderAndCreatedSkill() throws Exception {
        when(manageSkillsPort.createSkill("java")).thenReturn(JAVA_SKILL);
        when(apiMapper.domainToApi(JAVA_SKILL)).thenReturn(JAVA_SKILL_DTO);

        mockMvc.perform(post("/v1/admin/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SkillDto(null, "java"))))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/v1/admin/skills/" + SKILL_ID))
                .andExpect(jsonPath("$.id").value(SKILL_ID.toString()))
                .andExpect(jsonPath("$.name").value("java"));
    }

    @Test
    void createSkill_skillNameFromRequestBody_passedToPort() throws Exception {
        when(manageSkillsPort.createSkill("typescript")).thenReturn(new Skill(UUID.randomUUID(), "typescript"));
        when(apiMapper.domainToApi(any())).thenReturn(new SkillDto(UUID.randomUUID(), "typescript"));

        mockMvc.perform(post("/v1/admin/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SkillDto(null, "typescript"))))
                .andExpect(status().isCreated());

        verify(manageSkillsPort).createSkill("typescript");
    }

    @Test
    void deleteSkill_existingId_returns204() throws Exception {
        mockMvc.perform(delete("/v1/admin/skills/{skillId}", SKILL_ID))
                .andExpect(status().isNoContent());

        verify(manageSkillsPort).deleteSkill(SKILL_ID);
    }

    @Test
    void deleteSkill_nonExistingId_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Skill not found"))
                .when(manageSkillsPort).deleteSkill(SKILL_ID);

        mockMvc.perform(delete("/v1/admin/skills/{skillId}", SKILL_ID))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteSkill_invalidUuidPathVariable_returns400() throws Exception {
        mockMvc.perform(delete("/v1/admin/skills/not-a-uuid"))
                .andExpect(status().isBadRequest());
    }

    private static Skill any() {
        return org.mockito.ArgumentMatchers.any();
    }

    @RestControllerAdvice
    static class ResourceNotFoundExceptionHandler {
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<Void> handleNotFound(ResourceNotFoundException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
