package com.org.mes.io.Mes.io.entity;

import com.org.mes.io.Mes.io.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
//@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User  {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; //should be (hashed)

    private LocalDateTime createdAt = LocalDateTime.now();
}
