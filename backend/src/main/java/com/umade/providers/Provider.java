package com.umade.providers;

import com.umade.common.BaseEntity;
import com.umade.users.User;
import jakarta.persistence.*;

import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "providers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Provider extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(nullable = false)
    private String businessName;

    @Column(length = 2000)
    private String description;

    private String phone;
    private String website;
    private String instagram;
    private String tiktok;

    private String city;
    private String country;

    @Builder.Default
    private boolean verified = false;
}