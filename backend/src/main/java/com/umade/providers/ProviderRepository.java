package com.umade.providers;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProviderRepository extends JpaRepository<Provider, UUID> {

    List<Provider> findByCityIgnoreCase(String city);

    List<Provider> findByBusinessNameContainingIgnoreCase(String q);
}