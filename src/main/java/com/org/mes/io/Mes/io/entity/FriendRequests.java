package com.org.mes.io.Mes.io.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "friend_requests")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "friend_requests_seq")
    @SequenceGenerator(name = "friend_requests_seq", sequenceName = "friend_requests_seq", allocationSize = 1)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    public enum RequestStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}
