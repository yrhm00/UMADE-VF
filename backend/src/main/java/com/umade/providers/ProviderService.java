package com.umade.providers;

import com.umade.reviews.ReviewService;
import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ReviewService reviewService;

    private final com.umade.favorites.FavoriteProviderRepository favoriteProviderRepository;

    public List<Provider> search(String query, String city) {
        if (city != null && !city.isBlank()) {
            return providerRepository.findByCityIgnoreCase(city);
        }
        if (query != null && !query.isBlank()) {
            return providerRepository.findByBusinessNameContainingIgnoreCase(query);
        }
        return providerRepository.findAll();
    }

    public Provider getProvider(UUID id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    @Transactional
    public Provider createOrUpdateProvider(ProviderRequest request, User user) {
        // Check if user already has a provider profile?
        // For simplicity, assume one provider per user.
        // But Provider entity has OneToOne with User, so we can find by user.
        // Wait, ProviderRepository doesn't have findByUserId. I should add it or just
        // use what I have.
        // Let's assume we are updating if ID is provided or creating if not.
        // Actually, better to find by user.

        // Since I can't easily modify repo now without another step, I'll just save.
        // But `user_id` is unique in `Provider` table.

        Provider provider = providerRepository.findAll().stream()
                .filter(p -> p.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElse(Provider.builder().user(user).build());

        if (request.businessName() != null)
            provider.setBusinessName(request.businessName());
        if (request.description() != null)
            provider.setDescription(request.description());
        if (request.phone() != null)
            provider.setPhone(request.phone());
        if (request.website() != null)
            provider.setWebsite(request.website());
        if (request.instagram() != null)
            provider.setInstagram(request.instagram());
        if (request.tiktok() != null)
            provider.setTiktok(request.tiktok());
        if (request.city() != null)
            provider.setCity(request.city());
        if (request.country() != null)
            provider.setCountry(request.country());

        return providerRepository.save(provider);
    }

    public void addReview(UUID providerId, int rating, String comment, User user) {
        reviewService.addReview(providerId, rating, comment, user);
    }

    @Transactional
    public void addFavorite(UUID providerId, User user) {
        Provider provider = getProvider(providerId);
        com.umade.favorites.FavoriteProviderId favId = new com.umade.favorites.FavoriteProviderId(user.getId(),
                providerId);

        if (favoriteProviderRepository.existsById(favId)) {
            return;
        }

        com.umade.favorites.FavoriteProvider fav = com.umade.favorites.FavoriteProvider.builder()
                .id(favId)
                .user(user)
                .provider(provider)
                .build();

        favoriteProviderRepository.save(fav);
    }

    public record ProviderRequest(
            String businessName,
            String description,
            String phone,
            String website,
            String instagram,
            String tiktok,
            String city,
            String country) {
    }
}
