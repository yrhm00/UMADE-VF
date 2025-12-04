package com.umade.inspirations;

import com.umade.common.BaseEntity;
import com.umade.providers.Provider;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "inspirations")
public class Inspiration extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider; // peut être null si inspiration "plateforme"

    @Column(nullable = false)
    private String title;

    @Column(length = 4000)
    private String description;

    private String eventType; // Wedding, etc.
    private String mood; // Boho, Classy...
    private String budgetLevel; // LOW, MEDIUM, HIGH
    private String mainColor;

    @Column(nullable = false)
    private boolean publicVisible = true;

    // getters/setters
    // ...
}