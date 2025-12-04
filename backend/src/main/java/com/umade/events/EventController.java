package com.umade.events;

import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<Event> list(@AuthenticationPrincipal User user) {
        return eventService.getUserEvents(user);
    }

    @GetMapping("/{id}")
    public Event detail(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        return eventService.getEvent(id, user);
    }

    @PostMapping
    public Event create(@RequestBody EventService.EventRequest request, @AuthenticationPrincipal User user) {
        return eventService.createEvent(request, user);
    }

    @PutMapping("/{id}")
    public Event update(@PathVariable UUID id, @RequestBody EventService.EventRequest request,
            @AuthenticationPrincipal User user) {
        return eventService.updateEvent(id, request, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        eventService.deleteEvent(id, user);
        return ResponseEntity.noContent().build();
    }
}
