package com.umade.reviews;

import com.umade.providers.Provider;
import com.umade.providers.ProviderRepository;
import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProviderRepository providerRepository;

    public List<Review> getProviderReviews(UUID providerId) {
        return reviewRepository.findByProviderId(providerId);
    }

    @Transactional
    public Review addReview(UUID providerId, int rating, String comment, User author) {
        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review review = Review.builder()
                .provider(provider)
                .author(author)
                .rating(rating)
                .comment(comment)
                .build();

        return reviewRepository.save(review);
    }
}
