package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.repository;

import com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.entity.SubscriptionEntity;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SubscriptionJdbcRepository extends ListCrudRepository<SubscriptionEntity, UUID> {

    List<SubscriptionEntity> findBySkillAndRatingLessThanEqual(String skill, int rating);

    List<SubscriptionEntity> findByUserIdOrderByCreatedAtDesc(String userId);

    @Modifying
    @Query("DELETE FROM subscriptions WHERE id = :id AND user_id = :userId")
    int deleteByIdAndUserId(@Param("id") UUID id, @Param("userId") String userId);
}
