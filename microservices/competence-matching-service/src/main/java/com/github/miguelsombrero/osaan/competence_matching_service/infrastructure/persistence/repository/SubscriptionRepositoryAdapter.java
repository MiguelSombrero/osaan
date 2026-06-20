package com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.repository;

import com.github.miguelsombrero.osaan.competence_matching_service.domain.entity.Subscription;
import com.github.miguelsombrero.osaan.competence_matching_service.domain.repository.SubscriptionRepository;
import com.github.miguelsombrero.osaan.competence_matching_service.infrastructure.persistence.mapper.DomainEntitySubscriptionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class SubscriptionRepositoryAdapter implements SubscriptionRepository {

    private final SubscriptionJdbcRepository repository;
    private final DomainEntitySubscriptionMapper mapper;

    @Override
    public List<Subscription> findByUserId(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(mapper::entityToDomain)
                .toList();
    }

    @Override
    public Subscription save(Subscription subscription) {
        return mapper.entityToDomain(repository.save(mapper.domainToEntity(subscription)));
    }

    @Override
    public int deleteByIdAndUserId(UUID id, String userId) {
        return repository.deleteByIdAndUserId(id, userId);
    }

    @Override
    public List<Subscription> findBySkillAndRatingLessThanEqual(String skill, int rating) {
        return repository.findBySkillAndRatingLessThanEqual(skill, rating).stream()
                .map(mapper::entityToDomain)
                .toList();
    }
}
