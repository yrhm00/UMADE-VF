package com.umade.subscriptions;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderSubscriptionRepository
        extends JpaRepository<ProviderSubscription, ProviderSubscriptionId> {
}
