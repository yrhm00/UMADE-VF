package com.umade.notifications;

import jakarta.validation.constraints.NotBlank;

public record NotificationTokenRequest(@NotBlank String token) {
}
