package com.umade.favorites;

import com.umade.inspirations.Inspiration;
import com.umade.users.User;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class FavoriteInspirationId implements Serializable {

    private UUID userId;
    private UUID inspirationId;

    public FavoriteInspirationId() {
    }

    public FavoriteInspirationId(UUID userId, UUID inspirationId) {
        this.userId = userId;
        this.inspirationId = inspirationId;
    }

    // equals/hashCode
    // ...
}