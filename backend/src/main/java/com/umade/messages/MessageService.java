package com.umade.messages;

import com.umade.users.User;
import com.umade.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<Conversation> getUserConversations(User user) {
        return conversationRepository.findByUserId(user.getId());
    }

    public List<Message> getMessages(UUID conversationId, User user) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conv.getUser1().getId().equals(user.getId()) && !conv.getUser2().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Transactional
    public Conversation startConversation(UUID otherUserId, User currentUser) {
        if (currentUser.getId().equals(otherUserId)) {
            throw new RuntimeException("Cannot chat with yourself");
        }

        return conversationRepository.findBetweenUsers(currentUser.getId(), otherUserId)
                .orElseGet(() -> {
                    User otherUser = userRepository.findById(otherUserId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    Conversation conv = Conversation.builder()
                            .user1(currentUser)
                            .user2(otherUser)
                            .build();
                    return conversationRepository.save(conv);
                });
    }

    @Transactional
    public Message sendMessage(UUID conversationId, String content, String attachmentUrl, User sender) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        if (!conv.getUser1().getId().equals(sender.getId()) && !conv.getUser2().getId().equals(sender.getId())) {
            throw new RuntimeException("Access denied");
        }

        Message msg = Message.builder()
                .conversation(conv)
                .sender(sender)
                .content(content)
                .attachmentUrl(attachmentUrl)
                .build();

        conv.setLastMessagePreview(content.length() > 50 ? content.substring(0, 50) + "..." : content);
        conversationRepository.save(conv);

        return messageRepository.save(msg);
    }
}
