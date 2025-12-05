package com.umade.inspirations;

import com.umade.favorites.FavoriteInspiration;
import com.umade.favorites.FavoriteInspirationId;
import com.umade.favorites.FavoriteInspirationRepository;
import com.umade.providers.Provider;
import com.umade.providers.ProviderRepository;
import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InspirationService {

    private final InspirationRepository inspirationRepository;
    private final InspirationReportRepository inspirationReportRepository;
    private final FavoriteInspirationRepository favoriteRepo;
    private final ProviderRepository providerRepository;

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
    public Inspiration createInspiration(InspirationRequest request, User user) {
        Provider provider = null;

        if (request.providerId() != null) {
            provider = providerRepository.findById(request.providerId())
                    .orElseThrow(() -> new RuntimeException("Prestataire introuvable"));
        } else {
            provider = providerRepository.findByUserId(user.getId()).orElse(null);
        }

        Inspiration inspiration = Inspiration.builder()
                .provider(provider)
                .title(request.title())
                .description(request.description())
                .eventType(request.eventType())
                .mood(request.mood())
                .budgetLevel(request.budgetLevel())
                .mainColor(request.mainColor())
                .publicVisible(request.publicVisible() == null || request.publicVisible())
                .build();

        if (request.media() != null) {
            List<InspirationMedia> medias = request.media().stream()
                    .filter(m -> m.url() != null && !m.url().isBlank())
                    .map(m -> InspirationMedia.builder()
                            .inspiration(inspiration)
                            .mediaUrl(m.url())
                            .mediaType(m.mediaType())
                            .position(m.position() == null ? 0 : m.position())
                            .build())
                    .toList();

            inspiration.getMedia().clear();
            inspiration.getMedia().addAll(medias);
        }

        return inspirationRepository.save(inspiration);
    }

    @Transactional
    public InspirationActionResponse addFavorite(UUID inspirationId, User user) {
        Inspiration inspiration = getInspiration(inspirationId);
        FavoriteInspirationId favId = new FavoriteInspirationId(user.getId(), inspiration.getId());

        if (!favoriteRepo.existsById(favId)) {
            FavoriteInspiration fav = FavoriteInspiration.builder()
                    .id(favId)
                    .user(user)
                    .inspiration(inspiration)
                    .build();

            favoriteRepo.save(fav);
            inspiration.setFavoriteCount(inspiration.getFavoriteCount() + 1);
            inspirationRepository.save(inspiration);
        }

        return buildActionResponse(inspiration, user);
    }

    @Transactional
    public InspirationActionResponse removeFavorite(UUID inspirationId, User user) {
        Inspiration inspiration = getInspiration(inspirationId);
        FavoriteInspirationId favId = new FavoriteInspirationId(user.getId(), inspirationId);

        if (favoriteRepo.existsById(favId)) {
            favoriteRepo.deleteById(favId);
            inspiration.setFavoriteCount(Math.max(0, inspiration.getFavoriteCount() - 1));
            inspirationRepository.save(inspiration);
        }

        return buildActionResponse(inspiration, user);
    }

    @Transactional
    public InspirationActionResponse report(UUID inspirationId, ReportRequest request, User user) {
        Inspiration inspiration = getInspiration(inspirationId);

        if (!inspirationReportRepository.existsByUserAndInspiration(user, inspiration)) {
            InspirationReport report = InspirationReport.builder()
                    .user(user)
                    .inspiration(inspiration)
                    .reason(request.reason())
                    .build();

            inspirationReportRepository.save(report);
            inspiration.setReportCount(inspiration.getReportCount() + 1);
            inspirationRepository.save(inspiration);
        }

        return buildActionResponse(inspiration, user);
    }

    private InspirationActionResponse buildActionResponse(Inspiration inspiration, User user) {
        boolean favorite = favoriteRepo.existsByUserAndInspiration(user, inspiration);
        boolean reported = inspirationReportRepository.existsByUserAndInspiration(user, inspiration);

        return new InspirationActionResponse(
                inspiration.getId(),
                inspiration.getFavoriteCount(),
                inspiration.getReportCount(),
                favorite,
                reported
        );
    }

    public record InspirationRequest(
            String title,
            String description,
            String eventType,
            String mood,
            String budgetLevel,
            String mainColor,
            Boolean publicVisible,
            UUID providerId,
            List<MediaRequest> media
    ) {
    }

    public record MediaRequest(String url, String mediaType, Integer position) {
    }

    public record ReportRequest(String reason) {
    }

    public record InspirationActionResponse(
            UUID inspirationId,
            int favoriteCount,
            int reportCount,
            boolean favorite,
            boolean reported
    ) {
    }
}
