package com.umade.inspirations;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InspirationRepository extends JpaRepository<Inspiration, UUID> {

    Page<Inspiration> findByPublicVisibleTrue(Pageable pageable);

    Page<Inspiration> findByPublicVisibleTrueAndTitleContainingIgnoreCase(
            String term, Pageable pageable);
}