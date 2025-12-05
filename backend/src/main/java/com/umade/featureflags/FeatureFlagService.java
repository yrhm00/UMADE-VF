package com.umade.featureflags;

import com.umade.common.FeatureDisabledException;
import com.umade.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeatureFlagService {

    private final FeatureFlagProperties properties;

    public boolean isMessagingEnabled(User user) {
        return isEnabledForUser(properties.getMessaging(), user);
    }

    public boolean isNotificationsEnabled(User user) {
        return isEnabledForUser(properties.getNotifications(), user);
    }

    public void ensureMessagingEnabled(User user) {
        if (!isMessagingEnabled(user)) {
            throw new FeatureDisabledException("Messaging feature is not yet enabled for this account.");
        }
    }

    public void ensureNotificationsEnabled(User user) {
        if (!isNotificationsEnabled(user)) {
            throw new FeatureDisabledException("Notifications feature is not yet enabled for this account.");
        }
    }

    private boolean isEnabledForUser(FeatureFlagProperties.FeatureToggle toggle, User user) {
        if (toggle == null || !toggle.isEnabled() || user == null) {
            return false;
        }

        UUID userId = user.getId();
        if (toggle.getAllowList().contains(userId)) {
            return true;
        }

        int rolloutPercentage = toggle.getRolloutPercentage();
        if (rolloutPercentage <= 0) {
            return false;
        }
        if (rolloutPercentage >= 100) {
            return true;
        }

        int bucket = Math.floorMod(userId.hashCode(), 100);
        return bucket < rolloutPercentage;
    }
}
