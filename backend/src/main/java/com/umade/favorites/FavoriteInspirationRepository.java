package com.umade.favorites;

import com.umade.users.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteInspirationRepository
        extends JpaRepository<FavoriteInspiration, FavoriteInspirationId> {

    Page<FavoriteInspiration> findByUser(User user, Pageable pageable);
}