package com.umade.favorites;

import com.umade.inspirations.Inspiration;
import com.umade.users.User;
import jakarta.persistence.*;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteInspirationId implements Serializable {

    private UUID userId;
    private UUID inspirationId;
}