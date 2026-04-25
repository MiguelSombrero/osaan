package com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.valueobject.SkillName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;

class SkillTest {

    @Test
    void create_validName_returnsSkillWithNullIdAndNormalizedName() {
        Skill skill = Skill.create("  Java  ");

        assertThat(skill.id()).isNull();
        assertThat(skill.name()).isEqualTo("java");
    }

    @Test
    void create_uppercaseName_normalizedToLowercase() {
        Skill skill = Skill.create("KUBERNETES");

        assertThat(skill.name()).isEqualTo("kubernetes");
    }

    @Test
    void create_nullName_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> Skill.create(null));
    }

    @Test
    void create_blankName_throwsIllegalArgumentException() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> Skill.create("   "));
    }

    @Test
    void create_nameTooLong_throwsIllegalArgumentException() {
        String name = "a".repeat(SkillName.MAX_LENGTH + 1);

        assertThatIllegalArgumentException()
                .isThrownBy(() -> Skill.create(name));
    }
}
