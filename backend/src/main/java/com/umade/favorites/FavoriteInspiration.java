package com.umade.favorites;

import com.umade.inspirations.Inspiration;
import com.umade.users.User;
import com.umade.common.BaseEntity;
import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "favorites_inspirations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FavoriteInspiration extends BaseEntity {

    @EmbeddedId
    private FavoriteInspirationId id;

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("inspirationId")
    private Inspiration inspiration;
}