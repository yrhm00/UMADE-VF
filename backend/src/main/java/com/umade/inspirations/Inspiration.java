package com.umade.inspirations;

import com.umade.common.BaseEntity;
import com.umade.providers.Provider;
import jakarta.persistence.*;

import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "inspirations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
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
    @Builder.Default
    private boolean publicVisible = true;

    @OneToMany(mappedBy = "inspiration", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<InspirationMedia> media = new ArrayList<>();

    @Builder.Default
    private int favoriteCount = 0;

    @Builder.Default
    private int reportCount = 0;
}