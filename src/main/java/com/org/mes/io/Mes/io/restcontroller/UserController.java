package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.securityconfig.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    private User getUserFromToken(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Παλαιό /all (μπορείς να το κρατήσεις)
    @GetMapping("/all")
    public List<User> getAllUsers(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findAll()
                .stream()
                .filter(u -> !u.getUsername().equals(username))
                .toList();
    }

    // /me: επιστρέφει το User entity (ιδανικά DTO αλλά για δοκιμή επιστρέφουμε το entity)
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        return ResponseEntity.ok(user);
    }

    // search by email -> returns user if found
    @GetMapping("/search")
    public ResponseEntity<User> searchByEmail(@RequestParam String email, @RequestHeader("Authorization") String token) {
        // token check για να βεβαιωθούμε ότι είναι logged in
        getUserFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
}
