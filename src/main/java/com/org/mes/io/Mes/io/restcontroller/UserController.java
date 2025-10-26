package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.securityconfig.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @GetMapping("/all")
    public List<User> getAllUsers(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findAll()
                .stream()
                .filter(u -> !u.getUsername().equals(username))
                .toList();
    }

    @GetMapping("/me")
    public ResponseEntity<String> getCurrentUser(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return ResponseEntity.ok(username);
    }


}
