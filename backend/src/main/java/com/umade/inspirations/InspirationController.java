package com.umade.inspirations;

import com.umade.favorites.FavoriteInspiration;
import com.umade.favorites.FavoriteInspirationId;
import com.umade.favorites.FavoriteInspirationRepository;
import com.umade.users.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/inspirations")
public class InspirationController {

    private final InspirationRepository inspirationRepository;
    private final FavoriteInspirationRepository favoriteRepo;

    public InspirationController(InspirationRepository inspirationRepository,
            FavoriteInspirationRepository favoriteRepo) {
        this.inspirationRepository = inspirationRepository;
        this.favoriteRepo = favoriteRepo;
    }

    @GetMapping
    public Page<Inspiration> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q) {
        PageRequest pr = PageRequest.of(page, size);
        if (q != null && !q.isBlank()) {
            return inspirationRepository
                    .findByPublicVisibleTrueAndTitleContainingIgnoreCase(q, pr);
        }
        return inspirationRepository.findByPublicVisibleTrue(pr);
    }

    @GetMapping("/{id}")
    public Inspiration detail(@PathVariable UUID id) {
        return inspirationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspiration introuvable"));
    }

    @PostMapping("/{id}/favorite")
    public void addFavorite(@PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        Inspiration inspiration = inspirationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inspiration introuvable"));

        FavoriteInspirationId favId = new FavoriteInspirationId(
                user.getId(), inspiration.getId());
        if (favoriteRepo.existsById(favId))
            return;

        FavoriteInspiration fav = new FavoriteInspiration();
        fav.setId(favId);
        fav.setUser(user);
        fav.setInspiration(inspiration);
        favoriteRepo.save(fav);
    }

    @DeleteMapping("/{id}/favorite")
    public void removeFavorite(@PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        FavoriteInspirationId favId = new FavoriteInspirationId(
                user.getId(), id);
        favoriteRepo.deleteById(favId);
    }
}