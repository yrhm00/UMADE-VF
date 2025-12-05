package com.umade.favorites;

import jakarta.persistence.*;

import lombok.*;

import java.io.Serializable;

import java.util.UUID;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteInspirationId implements Serializable {

    private UUID userId;
    private UUID inspirationId;
}