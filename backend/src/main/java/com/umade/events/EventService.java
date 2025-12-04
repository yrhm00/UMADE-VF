package com.umade.events;

import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getUserEvents(User user) {
        return eventRepository.findByUserId(user.getId());
    }

    public Event getEvent(UUID id, User user) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        if (!event.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return event;
    }

    @Transactional
    public Event createEvent(EventRequest request, User user) {
        Event event = Event.builder()
                .user(user)
                .title(request.title())
                .description(request.description())
                .eventDate(request.eventDate())
                .location(request.location())
                .coverImageUrl(request.coverImageUrl())
                .guestCount(request.guestCount())
                .build();
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(UUID id, EventRequest request, User user) {
        Event event = getEvent(id, user);

        if (request.title() != null)
            event.setTitle(request.title());
        if (request.description() != null)
            event.setDescription(request.description());
        if (request.eventDate() != null)
            event.setEventDate(request.eventDate());
        if (request.location() != null)
            event.setLocation(request.location());
        if (request.coverImageUrl() != null)
            event.setCoverImageUrl(request.coverImageUrl());
        if (request.guestCount() != null)
            event.setGuestCount(request.guestCount());

        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(UUID id, User user) {
        Event event = getEvent(id, user);
        eventRepository.delete(event);
    }

    public record EventRequest(
            String title,
            String description,
            java.time.LocalDateTime eventDate,
            String location,
            String coverImageUrl,
            Integer guestCount) {
    }
}
