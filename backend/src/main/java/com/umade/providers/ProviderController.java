package com.umade.providers;

import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public List<Provider> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String city) {
        return providerService.search(q, city);
    }

    @GetMapping("/{id}")
    public Provider detail(@PathVariable UUID id) {
        return providerService.getProvider(id);
    }

    @PostMapping("/me")
    public Provider createOrUpdate(@RequestBody ProviderService.ProviderRequest request,
            @AuthenticationPrincipal User user) {
        return providerService.createOrUpdateProvider(request, user);
    }

    @PutMapping("/me")
    public Provider update(@RequestBody ProviderService.ProviderRequest request, @AuthenticationPrincipal User user) {
        return providerService.createOrUpdateProvider(request, user);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<Void> addReview(
            @PathVariable UUID id,
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {
        providerService.addReview(id, request.rating(), request.comment(), user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> addFavorite(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        providerService.addFavorite(id, user);
        return ResponseEntity.ok().build();
    }

    public record ReviewRequest(int rating, String comment) {
    }
}
