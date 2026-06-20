package com.github.miguelsombrero.osaan.competence_matching_service.application.service;

import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.repository.SubscriptionRepository;
import com.github.miguelsombrero.osaan.core.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ManageSubscriptionsServiceTest {

    private static final String USER_ID = "11111111-2222-3333-4444-555555555555";
    private static final String EMAIL = "anna.korhonen@example.com";
    private static final UUID SUB_ID = UUID.fromString("c4a6f97b-2d51-49c7-8a7e-5f2d9a1e34b8");

    @Mock
    private SubscriptionRepository repository;

    @InjectMocks
    private ManageSubscriptionsService service;

    @Test
    void getSubscriptions_returnsRepositoryListForUser() {
        Subscription sub = new Subscription(SUB_ID, USER_ID, EMAIL, "python", 3, Instant.now());
        when(repository.findByUserId(USER_ID)).thenReturn(List.of(sub));

        List<Subscription> result = service.getSubscriptions(USER_ID);

        assertThat(result).containsExactly(sub);
        verify(repository).findByUserId(USER_ID);
    }

    @Test
    void createSubscription_populatesUserIdEmailAndCreatedAt_andTrimsSkill_thenSaves() {
        Subscription saved = new Subscription(SUB_ID, USER_ID, EMAIL, "python", 3, Instant.now());
        when(repository.save(any(Subscription.class))).thenReturn(saved);

        Subscription result = service.createSubscription(USER_ID, EMAIL, "  python  ", 3);

        assertThat(result).isEqualTo(saved);

        ArgumentCaptor<Subscription> captor = ArgumentCaptor.forClass(Subscription.class);
        verify(repository).save(captor.capture());
        Subscription persisted = captor.getValue();
        assertThat(persisted.getId()).isNull();
        assertThat(persisted.getUserId()).isEqualTo(USER_ID);
        assertThat(persisted.getEmail()).isEqualTo(EMAIL);
        assertThat(persisted.getSkill()).isEqualTo("python");
        assertThat(persisted.getRating()).isEqualTo(3);
        assertThat(persisted.getCreatedAt()).isNotNull();
    }

    @Test
    void deleteSubscription_existingForUser_delegatesToRepository() {
        when(repository.deleteByIdAndUserId(SUB_ID, USER_ID)).thenReturn(1);

        service.deleteSubscription(USER_ID, SUB_ID);

        verify(repository).deleteByIdAndUserId(SUB_ID, USER_ID);
    }

    @Test
    void deleteSubscription_notOwnedOrMissing_throwsResourceNotFound() {
        when(repository.deleteByIdAndUserId(SUB_ID, USER_ID)).thenReturn(0);

        assertThatThrownBy(() -> service.deleteSubscription(USER_ID, SUB_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Subscription not found");
    }
}
