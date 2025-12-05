package com.umade.providers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProviderRepository extends JpaRepository<Provider, UUID> {
    @Query("""
            SELECT p FROM Provider p
            WHERE (:city IS NULL OR LOWER(p.city) = LOWER(:city))
            AND (:category IS NULL OR LOWER(p.category) = LOWER(:category))
            AND (:q IS NULL OR LOWER(p.businessName) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    List<Provider> search(String q, String city, String category);

    Optional<Provider> findByUserId(UUID userId);
}