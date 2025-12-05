package com.umade.notifications;

import com.umade.featureflags.FeatureFlagService;
import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final FeatureFlagService featureFlagService;

    public List<Notification> getUserNotifications(User user) {
        featureFlagService.ensureNotificationsEnabled(user);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public void markAllAsRead(User user) {
        featureFlagService.ensureNotificationsEnabled(user);
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    @Transactional
    public void sendNotification(User user, String title, String body, String type, String referenceId) {
        featureFlagService.ensureNotificationsEnabled(user);
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .body(body)
                .type(type)
                .referenceId(referenceId)
                .build();
        notificationRepository.save(notification);

        // TODO: Send FCM push notification
    }
}
