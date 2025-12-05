package com.umade.inspirations;

import com.umade.favorites.FavoriteInspiration;
import com.umade.favorites.FavoriteInspirationId;
import com.umade.favorites.FavoriteInspirationRepository;
import com.umade.users.User;
import com.umade.analytics.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InspirationService {

    private final InspirationRepository inspirationRepository;
    private final FavoriteInspirationRepository favoriteRepo;
    private final AnalyticsService analyticsService;

    public Page<Inspiration> list(int page, int size, String query) {
        PageRequest pr = PageRequest.of(page, size);
        if (query != null && !query.isBlank()) {
            return inspirationRepository.findByPublicVisibleTrueAndTitleContainingIgnoreCase(query, pr);
        }
        return inspirationRepository.findByPublicVisibleTrue(pr);
    }

    public Inspiration getInspiration(UUID id) {
        return inspirationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspiration introuvable"));
    }

    @Transactional
    public void addFavorite(UUID inspirationId, User user) {
        Inspiration inspiration = getInspiration(inspirationId);
        FavoriteInspirationId favId = new FavoriteInspirationId(user.getId(), inspiration.getId());

        if (favoriteRepo.existsById(favId)) {
            return;
        }

        FavoriteInspiration fav = FavoriteInspiration.builder()
                .id(favId)
                .user(user)
                .inspiration(inspiration)
                .build();

        favoriteRepo.save(fav);
        analyticsService.trackEvent(user.getId().toString(), "Inspiration Favorited", Map.of(
                "inspirationId", inspiration.getId().toString(),
                "title", inspiration.getTitle(),
                "authorId", inspiration.getAuthor().getId().toString()
        ));
    }

    @Transactional
    public void removeFavorite(UUID inspirationId, User user) {
        FavoriteInspirationId favId = new FavoriteInspirationId(user.getId(), inspirationId);
        favoriteRepo.deleteById(favId);
    }
}
