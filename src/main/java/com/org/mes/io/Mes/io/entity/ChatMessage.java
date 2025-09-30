package com.org.mes.io.Mes.io.entity;

import com.org.mes.io.Mes.io.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    private String content;

    private LocalDateTime timestamp = LocalDateTime.now();
}
