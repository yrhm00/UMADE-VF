package com.umade.notifications;

import com.umade.common.BaseEntity;
import com.umade.users.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String body;

    @Builder.Default
    private boolean read = false;

    private String type; // MESSAGE, REVIEW, etc.
    private String referenceId; // ID of the related entity
}
