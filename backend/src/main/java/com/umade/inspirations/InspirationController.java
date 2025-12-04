package com.umade.inspirations;

import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/inspirations")
@RequiredArgsConstructor
public class InspirationController {

    private final InspirationService inspirationService;

    @GetMapping
    public Page<Inspiration> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String q) {
        return inspirationService.list(page, size, q);
    }

    @GetMapping("/{id}")
    public Inspiration detail(@PathVariable UUID id) {
        return inspirationService.getInspiration(id);
    }

    @PostMapping("/{id}/favorite")
    public void addFavorite(@PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        inspirationService.addFavorite(id, user);
    }

    @DeleteMapping("/{id}/favorite")
    public void removeFavorite(@PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        inspirationService.removeFavorite(id, user);
    }
}