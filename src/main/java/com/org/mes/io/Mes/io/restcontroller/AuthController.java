package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.service.UserService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = userService.loginUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new JwtResponse(token));
    }
}

@Data
class RegisterRequest {
    private String username;
    private String email;
    private String password;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}

@Data
class JwtResponse {
    private final String token;
}

