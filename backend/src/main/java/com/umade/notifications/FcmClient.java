package com.umade.notifications;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class FcmClient {

    private static final String FCM_URL = "https://fcm.googleapis.com/fcm/send";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${fcm.server-key:}")
    private String serverKey;

    public void send(List<String> tokens, String title, String body, String type, String referenceId) {
        if (tokens == null || tokens.isEmpty()) {
            return;
        }
        if (serverKey == null || serverKey.isBlank()) {
            log.warn("FCM server key is not configured; skipping push notification");
            return;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(HttpHeaders.AUTHORIZATION, "key=" + serverKey);

        Map<String, Object> notification = Map.of(
                "title", title,
                "body", body
        );
        Map<String, Object> data = new HashMap<>();
        data.put("type", type);
        data.put("referenceId", referenceId);

        Map<String, Object> payload = new HashMap<>();
        payload.put("registration_ids", tokens);
        payload.put("notification", notification);
        payload.put("data", data);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(FCM_URL, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Failed to send FCM notification: status={} body={} ", response.getStatusCode(), response.getBody());
            }
        } catch (Exception ex) {
            log.error("Error while sending FCM notification", ex);
        }
    }
}
