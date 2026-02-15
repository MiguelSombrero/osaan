package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.repository;

import com.github.miguelsombrero.osaan.skill_catalog_service.domain.repository.SkillRepository;
import com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.persistence.mapper.DomainEntitySkillMapper;
import com.github.miguelsombrero.osaan.skill_catalog_service.domain.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class SkillRepositoryAdapter implements SkillRepository {

    private final PagingAndSortingSkillRepository repository;
    private final DomainEntitySkillMapper mapper;

    public SkillRepositoryAdapter(PagingAndSortingSkillRepository repository, DomainEntitySkillMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Optional<Skill> findById(UUID id) {
        return repository.findById(id).map(mapper::entityToDomain);
    }

    @Override
    public Page<Skill> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::entityToDomain);
    }

    @Override
    public Skill save(Skill skill) {
        return mapper.entityToDomain(repository.save(mapper.domainToEntity(skill)));
    }

    @Override
    public Optional<Skill> findByNameIgnoreCase(String name) {
        return repository.findByNameIgnoreCase(name).map(mapper::entityToDomain);
    }

    @Override
    public List<Skill> findByNameContainingIgnoreCase(String name, Pageable pageable) {
        return repository.findByNameContainingIgnoreCase(name, pageable).stream()
                .map(mapper::entityToDomain)
                .toList();
    }

    @Override
    public long countByNameContainingIgnoreCase(String name) {
        return repository.countByNameContainingIgnoreCase(name);
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }
}
