package com.umade.notifications;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationTokenRepository extends JpaRepository<NotificationToken, UUID> {
    List<NotificationToken> findByUserId(UUID userId);
    Optional<NotificationToken> findByToken(String token);
    boolean existsByUserIdAndToken(UUID userId, String token);
    void deleteByUserIdAndToken(UUID userId, String token);
}
