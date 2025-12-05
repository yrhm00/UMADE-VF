package com.umade.providers;

import java.util.UUID;

public class ProviderResponses {
    public record ProviderSummaryResponse(
            UUID id,
            String businessName,
            String city,
            String country,
            String category,
            double averageRating,
            int reviewCount,
            boolean favorite,
            boolean subscribed) {
    }

    public record ProviderDetailResponse(
            UUID id,
            String businessName,
            String description,
            String phone,
            String website,
            String instagram,
            String tiktok,
            String city,
            String country,
            String category,
            double averageRating,
            int reviewCount,
            boolean favorite,
            boolean subscribed) {
    }

    public record ProviderActionResponse(boolean active) {
    }
}
