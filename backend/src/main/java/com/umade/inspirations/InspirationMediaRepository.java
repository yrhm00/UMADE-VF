package com.umade.inspirations;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InspirationMediaRepository extends JpaRepository<InspirationMedia, UUID> {
}
