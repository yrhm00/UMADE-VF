package com.umade.favorites;

import com.umade.inspirations.Inspiration;
import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteInspirationRepository favoriteInspirationRepository;

    public Page<Inspiration> getFavoriteInspirations(User user, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return favoriteInspirationRepository
                .findByUser(user, pageRequest)
                .map(FavoriteInspiration::getInspiration);
    }
}
