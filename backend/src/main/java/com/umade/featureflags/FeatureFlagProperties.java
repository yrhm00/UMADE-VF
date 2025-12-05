package com.umade.featureflags;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Component
@Validated
@ConfigurationProperties(prefix = "umade.feature-flags")
public class FeatureFlagProperties {

    private FeatureToggle messaging = new FeatureToggle();
    private FeatureToggle notifications = new FeatureToggle();

    @Data
    public static class FeatureToggle {
        private boolean enabled = false;

        @Min(0)
        @Max(100)
        private int rolloutPercentage = 0;

        private List<UUID> allowList = new ArrayList<>();
    }
}
