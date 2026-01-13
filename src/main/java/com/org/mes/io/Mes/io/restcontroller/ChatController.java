package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.dto.ChatMessageDto;
import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.FriendRequestsRepository;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.securityconfig.JwtUtil;
import com.org.mes.io.Mes.io.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository; // Πρόσθεσε αυτό
    private final FriendRequestsRepository friendRequestsRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestParam User sender,
            @RequestParam User receiver,
            @RequestParam String content) {
        // Αυτό μάλλον δεν χρησιμοποιείται πλέον (το χειρίζεται το WebSocket),
        // αλλά το αφήνουμε.
        return ResponseEntity.ok(chatMessageService.sendMessage(sender, receiver, content));
    }

    // --- ΣΗΜΑΝΤΙΚΗ ΑΛΛΑΓΗ ΕΔΩ ---
//    @GetMapping("/conversation")
//    public ResponseEntity<List<ChatMessageDto>> getConversation(
//            @RequestParam String username1,
//            @RequestParam String username2) {
//
//        // Βρες τους χρήστες από τα usernames
//        User user1 = userRepository.findByUsername(username1)
//                .orElseThrow(() -> new RuntimeException("User " + username1 + " not found"));
//        User user2 = userRepository.findByUsername(username2)
//                .orElseThrow(() -> new RuntimeException("User " + username2 + " not found"));
//
//        // Επιστροφή της λίστας DTOs
//        return ResponseEntity.ok(chatMessageService.getConversation(user1, user2));
//    }
    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessageDto>> getConversation(
            @RequestParam String username1,
            @RequestParam String username2,
            @RequestHeader("Authorization") String token) {

        String requester = jwtUtil.extractUsername(token.replace("Bearer ", ""));

        if (!requester.equals(username1) && !requester.equals(username2)) {
            throw new RuntimeException("Unauthorized");
        }

        User user1 = userRepository.findByUsername(username1).orElseThrow();
        User user2 = userRepository.findByUsername(username2).orElseThrow();

        if (!friendRequestsRepository.areFriends(user1, user2)) {
            throw new RuntimeException("Users are not friends");
        }

        return ResponseEntity.ok(chatMessageService.getConversation(user1, user2));
    }

}