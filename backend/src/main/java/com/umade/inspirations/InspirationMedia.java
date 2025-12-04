package com.umade.inspirations;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "inspiration_media")
public class InspirationMedia {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inspiration_id")
    private Inspiration inspiration;

    @Column(nullable = false)
    private String mediaUrl;

    @Column(nullable = false)
    private String mediaType; // IMAGE / VIDEO

    private int position;

    // getters/setters
    // ...
}