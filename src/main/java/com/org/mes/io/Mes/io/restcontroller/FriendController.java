package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.Friends;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.securityconfig.JwtUtil;
import com.org.mes.io.Mes.io.service.FriendsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendsService friendsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    private User getUserFromToken(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<FriendRequests> sendRequest(
            @RequestHeader("Authorization") String token,
            @PathVariable Long receiverId) {

        User sender = getUserFromToken(token);
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        return ResponseEntity.ok(friendsService.sendRequest(sender, receiver));
    }

    @PostMapping("/respond/{requestId}")
    public ResponseEntity<FriendRequests> respond(
            @RequestHeader("Authorization") String token,
            @PathVariable Long requestId,
            @RequestParam boolean accept) {

        // Optional: verify user is the receiver
        return ResponseEntity.ok(friendsService.respondToRequest(requestId, accept));
    }

    @GetMapping("/my-friends")
    public ResponseEntity<List<User>> listFriends(@RequestHeader("Authorization") String token) {
        User user = getUserFromToken(token);
        return ResponseEntity.ok(friendsService.listFriendUsers(user));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequests>> getPendingRequests(
            @RequestHeader("Authorization") String token) {

        User receiver = getUserFromToken(token);
        return ResponseEntity.ok(friendsService.getPendingRequests(receiver));
    }
}
