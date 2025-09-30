package com.org.mes.io.Mes.io.service;

import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.securityconfig.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User registerUser(String username, String email, String password) {
        if (userRepository.existsByEmail(email) || userRepository.existsByUsername(username)) {
            throw new RuntimeException("User already exists");
        }
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .build();
        return userRepository.save(user);
    }

    public String loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return jwtUtil.generateToken(user.getUsername());
            }
        }
        throw new RuntimeException("Invalid email or password");
    }
}
