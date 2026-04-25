package com.github.miguelsombrero.osaan.skill_catalog_service.domain.valueobject;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;

class SkillNameTest {

    @Test
    void of_validName_trimsAndLowercases() {
        SkillName result = SkillName.of("  Java  ");

        assertThat(result.value()).isEqualTo("java");
    }

    @Test
    void of_mixedCaseWithInternalSpaces_normalizedFully() {
        SkillName result = SkillName.of("  SPRING Boot  ");

        assertThat(result.value()).isEqualTo("spring boot");
    }

    @Test
    void of_alreadyNormalized_returnedUnchanged() {
        SkillName result = SkillName.of("typescript");

        assertThat(result.value()).isEqualTo("typescript");
    }

    @Test
    void of_nullInput_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> SkillName.of(null))
                .withMessage("Skill name must not be null");
    }

    @Test
    void of_blankInput_throwsIllegalArgumentException() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> SkillName.of("   "))
                .withMessage("Skill name must not be blank");
    }

    @Test
    void of_emptyString_throwsIllegalArgumentException() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> SkillName.of(""))
                .withMessage("Skill name must not be blank");
    }

    @Test
    void of_exactMaxLength_accepted() {
        String name = "a".repeat(SkillName.MAX_LENGTH);

        SkillName result = SkillName.of(name);

        assertThat(result.value()).hasSize(SkillName.MAX_LENGTH);
    }

    @Test
    void of_exceedsMaxLength_throwsIllegalArgumentException() {
        String name = "a".repeat(SkillName.MAX_LENGTH + 1);

        assertThatIllegalArgumentException()
                .isThrownBy(() -> SkillName.of(name))
                .withMessageContaining("must not exceed " + SkillName.MAX_LENGTH + " characters");
    }

    @Test
    void of_maxLengthWithSurroundingSpaces_validAfterTrim() {
        // Validation is performed on the trimmed value, not the raw input
        String nameWithSpaces = "  " + "a".repeat(SkillName.MAX_LENGTH) + "  ";

        SkillName result = SkillName.of(nameWithSpaces);

        assertThat(result.value()).hasSize(SkillName.MAX_LENGTH);
    }

    @Test
    void constructor_nullValue_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new SkillName(null));
    }

    @Test
    void constructor_blankValue_throwsIllegalArgumentException() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> new SkillName("  "))
                .withMessage("Skill name must not be blank");
    }

    @Test
    void constructor_exceedsMaxLength_throwsIllegalArgumentException() {
        String name = "x".repeat(SkillName.MAX_LENGTH + 1);

        assertThatIllegalArgumentException()
                .isThrownBy(() -> new SkillName(name));
    }
}
