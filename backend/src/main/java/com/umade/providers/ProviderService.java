package com.umade.providers;

import com.umade.favorites.FavoriteProvider;
import com.umade.favorites.FavoriteProviderId;
import com.umade.favorites.FavoriteProviderRepository;
import com.umade.reviews.ReviewService;
import com.umade.reviews.ReviewRepository;
import com.umade.subscriptions.ProviderSubscription;
import com.umade.subscriptions.ProviderSubscriptionId;
import com.umade.subscriptions.ProviderSubscriptionRepository;
import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.umade.providers.ProviderResponses.*;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;
    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;
    private final FavoriteProviderRepository favoriteProviderRepository;
    private final ProviderSubscriptionRepository providerSubscriptionRepository;

    public List<ProviderSummaryResponse> search(String query, String city, String category, User user) {
        return providerRepository.search(query, city, category).stream()
                .map(provider -> toSummary(provider, user))
                .toList();
    }

    public ProviderDetailResponse getProvider(UUID id, User user) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        return toDetail(provider, user);
    }

    @Transactional
    public ProviderDetailResponse createOrUpdateProvider(ProviderRequest request, User user) {
        Provider provider = providerRepository.findByUserId(user.getId())
                .orElse(Provider.builder().user(user).build());

        Optional.ofNullable(request.businessName()).ifPresent(provider::setBusinessName);
        Optional.ofNullable(request.description()).ifPresent(provider::setDescription);
        Optional.ofNullable(request.phone()).ifPresent(provider::setPhone);
        Optional.ofNullable(request.website()).ifPresent(provider::setWebsite);
        Optional.ofNullable(request.instagram()).ifPresent(provider::setInstagram);
        Optional.ofNullable(request.tiktok()).ifPresent(provider::setTiktok);
        Optional.ofNullable(request.category()).ifPresent(provider::setCategory);
        Optional.ofNullable(request.city()).ifPresent(provider::setCity);
        Optional.ofNullable(request.country()).ifPresent(provider::setCountry);

        Provider saved = providerRepository.save(provider);
        return toDetail(saved, user);
    }

    public ProviderDetailResponse addReview(UUID providerId, int rating, String comment, User user) {
        reviewService.addReview(providerId, rating, comment, user);
        return getProvider(providerId, user);
    }

    @Transactional
    public ProviderActionResponse toggleFavorite(UUID providerId, User user) {
        if (user == null) {
            throw new RuntimeException("Authentication required");
        }
        FavoriteProviderId favId = new FavoriteProviderId(user.getId(), providerId);

        if (favoriteProviderRepository.existsById(favId)) {
            favoriteProviderRepository.deleteById(favId);
            return new ProviderActionResponse(false);
        }

        FavoriteProvider fav = FavoriteProvider.builder()
                .id(favId)
                .user(user)
                .provider(getProviderEntity(providerId))
                .build();

        favoriteProviderRepository.save(fav);
        return new ProviderActionResponse(true);
    }

    @Transactional
    public ProviderActionResponse toggleSubscription(UUID providerId, User user) {
        if (user == null) {
            throw new RuntimeException("Authentication required");
        }
        ProviderSubscriptionId subscriptionId = new ProviderSubscriptionId(user.getId(), providerId);

        if (providerSubscriptionRepository.existsById(subscriptionId)) {
            providerSubscriptionRepository.deleteById(subscriptionId);
            return new ProviderActionResponse(false);
        }

        ProviderSubscription subscription = ProviderSubscription.builder()
                .id(subscriptionId)
                .user(user)
                .provider(getProviderEntity(providerId))
                .build();

        providerSubscriptionRepository.save(subscription);
        return new ProviderActionResponse(true);
    }

    private ProviderSummaryResponse toSummary(Provider provider, User user) {
        ProviderStats stats = computeStats(provider.getId());
        return new ProviderSummaryResponse(
                provider.getId(),
                provider.getBusinessName(),
                provider.getCity(),
                provider.getCountry(),
                provider.getCategory(),
                stats.averageRating(),
                stats.reviewCount(),
                isFavorite(provider.getId(), user),
                isSubscribed(provider.getId(), user));
    }

    private ProviderDetailResponse toDetail(Provider provider, User user) {
        ProviderStats stats = computeStats(provider.getId());
        return new ProviderDetailResponse(
                provider.getId(),
                provider.getBusinessName(),
                provider.getDescription(),
                provider.getPhone(),
                provider.getWebsite(),
                provider.getInstagram(),
                provider.getTiktok(),
                provider.getCity(),
                provider.getCountry(),
                provider.getCategory(),
                stats.averageRating(),
                stats.reviewCount(),
                isFavorite(provider.getId(), user),
                isSubscribed(provider.getId(), user));
    }

    private ProviderStats computeStats(UUID providerId) {
        double averageRating = Optional.ofNullable(reviewRepository.findAverageRatingByProviderId(providerId)).orElse(0.0d);
        int reviewCount = (int) reviewRepository.countByProviderId(providerId);
        return new ProviderStats(averageRating, reviewCount);
    }

    private Provider getProviderEntity(UUID id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    private boolean isFavorite(UUID providerId, User user) {
        if (user == null) {
            return false;
        }
        return favoriteProviderRepository.existsById(new FavoriteProviderId(user.getId(), providerId));
    }

    private boolean isSubscribed(UUID providerId, User user) {
        if (user == null) {
            return false;
        }
        return providerSubscriptionRepository.existsById(new ProviderSubscriptionId(user.getId(), providerId));
    }

    private record ProviderStats(double averageRating, int reviewCount) {
    }

    public record ProviderRequest(
            String businessName,
            String description,
            String phone,
            String website,
            String instagram,
            String tiktok,
            String category,
            String city,
            String country) {
    }
}
