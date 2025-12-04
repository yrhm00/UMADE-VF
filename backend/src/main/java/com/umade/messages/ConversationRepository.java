package com.umade.messages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("SELECT c FROM Conversation c WHERE c.user1.id = :userId OR c.user2.id = :userId")
    List<Conversation> findByUserId(UUID userId);

    @Query("SELECT c FROM Conversation c WHERE (c.user1.id = :u1 AND c.user2.id = :u2) OR (c.user1.id = :u2 AND c.user2.id = :u1)")
    Optional<Conversation> findBetweenUsers(UUID u1, UUID u2);
}
