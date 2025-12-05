package com.umade.providers;

import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping
    public List<ProviderResponses.ProviderSummaryResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @AuthenticationPrincipal User user) {
        return providerService.search(q, city, category, user);
    }

    @GetMapping("/{id}")
    public ProviderResponses.ProviderDetailResponse detail(@PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return providerService.getProvider(id, user);
    }

    @PostMapping("/me")
    public ProviderResponses.ProviderDetailResponse createOrUpdate(
            @RequestBody ProviderService.ProviderRequest request,
            @AuthenticationPrincipal User user) {
        return providerService.createOrUpdateProvider(request, user);
    }

    @PutMapping("/me")
    public ProviderResponses.ProviderDetailResponse update(@RequestBody ProviderService.ProviderRequest request,
            @AuthenticationPrincipal User user) {
        return providerService.createOrUpdateProvider(request, user);
    }

    @PostMapping("/{id}/review")
    public ProviderResponses.ProviderDetailResponse addReview(
            @PathVariable UUID id,
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {
        return providerService.addReview(id, request.rating(), request.comment(), user);
    }

    @PostMapping("/{id}/favorite")
    public ProviderResponses.ProviderActionResponse toggleFavorite(@PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return providerService.toggleFavorite(id, user);
    }

    @PostMapping("/{id}/subscribe")
    public ProviderResponses.ProviderActionResponse toggleSubscription(@PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return providerService.toggleSubscription(id, user);
    }

    public record ReviewRequest(int rating, String comment) {
    }
}
