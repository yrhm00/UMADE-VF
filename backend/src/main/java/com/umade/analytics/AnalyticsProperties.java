package com.umade.analytics;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.util.StringUtils;

@ConfigurationProperties(prefix = "analytics")
public class AnalyticsProperties {

    private boolean enabled = true;

    @NestedConfigurationProperty
    private Segment segment = new Segment();

    @NestedConfigurationProperty
    private Amplitude amplitude = new Amplitude();

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Segment getSegment() {
        return segment;
    }

    public void setSegment(Segment segment) {
        this.segment = segment;
    }

    public Amplitude getAmplitude() {
        return amplitude;
    }

    public void setAmplitude(Amplitude amplitude) {
        this.amplitude = amplitude;
    }

    public boolean hasSegmentConfig() {
        return StringUtils.hasText(segment.getWriteKey());
    }

    public boolean hasAmplitudeConfig() {
        return StringUtils.hasText(amplitude.getApiKey());
    }

    public static class Segment {
        private String writeKey;
        private String endpoint = "https://api.segment.io/v1/track";

        public String getWriteKey() {
            return writeKey;
        }

        public void setWriteKey(String writeKey) {
            this.writeKey = writeKey;
        }

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }
    }

    public static class Amplitude {
        private String apiKey;
        private String endpoint = "https://api2.amplitude.com/2/httpapi";

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }
    }
}
