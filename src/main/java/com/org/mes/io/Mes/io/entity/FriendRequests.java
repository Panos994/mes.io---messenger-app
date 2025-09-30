package com.org.mes.io.Mes.io.entity;

import com.org.mes.io.Mes.io.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
