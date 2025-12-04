package com.umade.favorites;

import com.umade.inspirations.Inspiration;
import com.umade.users.User;
import com.umade.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "favorites_inspirations")
public class FavoriteInspiration extends BaseEntity {

    @EmbeddedId
    private FavoriteInspirationId id;

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("inspirationId")
    private Inspiration inspiration;

    // getters/setters
    // ...
}