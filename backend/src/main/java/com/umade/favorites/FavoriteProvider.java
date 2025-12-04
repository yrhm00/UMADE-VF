package com.umade.favorites;

import com.umade.common.BaseEntity;
import com.umade.providers.Provider;
import com.umade.users.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favorites_providers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FavoriteProvider extends BaseEntity {

    @EmbeddedId
    private FavoriteProviderId id;

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("providerId")
    private Provider provider;
}
