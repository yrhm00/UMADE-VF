package com.umade.inspirations;

import com.umade.common.BaseEntity;
import com.umade.users.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "inspiration_reports", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "inspiration_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class InspirationReport extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "inspiration_id")
    private Inspiration inspiration;

    @Column(length = 2000)
    private String reason;
}
