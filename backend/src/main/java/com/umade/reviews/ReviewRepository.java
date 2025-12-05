package com.umade.reviews;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProviderId(UUID providerId);

    long countByProviderId(UUID providerId);

    @org.springframework.data.jpa.repository.Query("select avg(r.rating) from Review r where r.provider.id = :providerId")
    Double findAverageRatingByProviderId(UUID providerId);
}
