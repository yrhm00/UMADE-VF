package com.umade.subscriptions;

import com.umade.common.BaseEntity;
import com.umade.providers.Provider;
import com.umade.users.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "providers_subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ProviderSubscription extends BaseEntity {

    @EmbeddedId
    private ProviderSubscriptionId id;

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("providerId")
    private Provider provider;
}
