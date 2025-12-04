package com.umade.messages;

import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public List<Conversation> list(@AuthenticationPrincipal User user) {
        return messageService.getUserConversations(user);
    }

    @PostMapping
    public Conversation start(@RequestBody StartConversationRequest request, @AuthenticationPrincipal User user) {
        return messageService.startConversation(request.userId(), user);
    }

    @GetMapping("/{id}/messages")
    public List<Message> getMessages(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return messageService.getMessages(id, user);
    }

    @PostMapping("/{id}/messages")
    public Message sendMessage(@PathVariable UUID id, @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal User user) {
        return messageService.sendMessage(id, request.content(), request.attachmentUrl(), user);
    }

    public record StartConversationRequest(UUID userId) {
    }

    public record SendMessageRequest(String content, String attachmentUrl) {
    }
}
