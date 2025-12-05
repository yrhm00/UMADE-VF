package com.umade.analytics;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AnalyticsService {

    private final AnalyticsProperties properties;
    private final RestTemplate restTemplate;

    public AnalyticsService(AnalyticsProperties properties, RestTemplate restTemplate) {
        this.properties = properties;
        this.restTemplate = restTemplate;
    }

    public void trackEvent(String userId, String eventName, Map<String, Object> props) {
        if (!properties.isEnabled()) {
            log.debug("Analytics disabled, skipping event {}", eventName);
            return;
        }

        Map<String, Object> safeProps = CollectionUtils.isEmpty(props) ? Collections.emptyMap() : props;
        sendSegment(userId, eventName, safeProps);
        sendAmplitude(userId, eventName, safeProps);
    }

    private void sendSegment(String userId, String eventName, Map<String, Object> props) {
        if (!properties.hasSegmentConfig()) {
            log.debug("Segment write key missing, event {} not sent", eventName);
            return;
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", userId);
        payload.put("event", eventName);
        payload.put("properties", props);
        payload.put("timestamp", Instant.now().toString());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(properties.getSegment().getWriteKey(), "");

        try {
            restTemplate.postForEntity(properties.getSegment().getEndpoint(), new HttpEntity<>(payload, headers), Void.class);
            log.debug("Segment event {} sent for user {}", eventName, userId);
        } catch (Exception ex) {
            log.warn("Failed to send Segment event {}: {}", eventName, ex.getMessage());
        }
    }

    private void sendAmplitude(String userId, String eventName, Map<String, Object> props) {
        if (!properties.hasAmplitudeConfig()) {
            log.debug("Amplitude API key missing, event {} not sent", eventName);
            return;
        }

        Map<String, Object> event = new HashMap<>();
        event.put("user_id", userId);
        event.put("event_type", eventName);
        event.put("event_properties", props);
        event.put("time", Instant.now().toEpochMilli());

        Map<String, Object> payload = new HashMap<>();
        payload.put("api_key", properties.getAmplitude().getApiKey());
        payload.put("events", List.of(event));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            restTemplate.postForEntity(properties.getAmplitude().getEndpoint(), new HttpEntity<>(payload, headers), Void.class);
            log.debug("Amplitude event {} sent for user {}", eventName, userId);
        } catch (Exception ex) {
            log.warn("Failed to send Amplitude event {}: {}", eventName, ex.getMessage());
        }
    }
}
