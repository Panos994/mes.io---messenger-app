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
public class Friends  {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User user1;

    @ManyToOne
    private User user2;

    private LocalDateTime createdAt = LocalDateTime.now();
}
