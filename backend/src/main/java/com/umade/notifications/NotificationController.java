package com.umade.notifications;

import com.umade.users.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> list(@AuthenticationPrincipal User user) {
        return notificationService.getUserNotifications(user);
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> readAll(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/token")
    public ResponseEntity<Void> registerToken(@AuthenticationPrincipal User user,
                                              @RequestBody @Valid NotificationTokenRequest request) {
        notificationService.registerToken(user, request.token());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/token")
    public ResponseEntity<Void> unregisterToken(@AuthenticationPrincipal User user,
                                                @RequestBody @Valid NotificationTokenRequest request) {
        notificationService.unregisterToken(user, request.token());
        return ResponseEntity.noContent().build();
    }
}
