package com.umade.favorites;

import com.umade.inspirations.Inspiration;
import com.umade.users.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavoriteInspirationRepository extends JpaRepository<FavoriteInspiration, FavoriteInspirationId> {

    List<FavoriteInspiration> findByUser(User user);

    Page<FavoriteInspiration> findByUser(User user, Pageable pageable);

    long countByIdInspirationId(UUID inspirationId);

    boolean existsByUserAndInspiration(User user, Inspiration inspiration);
}
