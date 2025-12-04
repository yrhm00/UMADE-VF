package com.umade.favorites;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteProviderRepository extends JpaRepository<FavoriteProvider, FavoriteProviderId> {
}
