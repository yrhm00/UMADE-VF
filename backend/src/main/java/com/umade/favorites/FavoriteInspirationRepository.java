package com.umade.favorites;

import com.umade.inspirations.Inspiration;
import com.umade.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteInspirationRepository
        extends JpaRepository<FavoriteInspiration, FavoriteInspirationId> {

    List<FavoriteInspiration> findByUser(User user);
}