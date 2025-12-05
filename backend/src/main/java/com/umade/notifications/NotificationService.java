package com.umade.notifications;

import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationTokenRepository notificationTokenRepository;
    private final FcmClient fcmClient;

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void sendNotification(User user, String title, String body, String type, String referenceId) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .body(body)
                .type(type)
                .referenceId(referenceId)
                .build();
        notificationRepository.save(notification);

        List<String> tokens = notificationTokenRepository.findByUserId(user.getId()).stream()
                .map(NotificationToken::getToken)
                .toList();

        fcmClient.send(tokens, title, body, type, referenceId);
    }

    @Transactional
    public void registerToken(User user, String token) {
        notificationTokenRepository.findByToken(token).ifPresent(existing -> {
            if (!existing.getUser().getId().equals(user.getId())) {
                existing.setUser(user);
                notificationTokenRepository.save(existing);
            }
        });

        if (!notificationTokenRepository.existsByUserIdAndToken(user.getId(), token)) {
            NotificationToken newToken = NotificationToken.builder()
                    .user(user)
                    .token(token)
                    .build();
            notificationTokenRepository.save(newToken);
        }
    }

    @Transactional
    public void unregisterToken(User user, String token) {
        notificationTokenRepository.deleteByUserIdAndToken(user.getId(), token);
    }
}
