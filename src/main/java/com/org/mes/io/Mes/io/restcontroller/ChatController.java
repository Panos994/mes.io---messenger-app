package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.dto.ChatMessageDto;
import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository; // Πρόσθεσε αυτό

    // Τροποποίησε τον constructor
    public ChatController(ChatMessageService chatMessageService, UserRepository userRepository) {
        this.chatMessageService = chatMessageService;
        this.userRepository = userRepository;
    }

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
    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessageDto>> getConversation(
            @RequestParam String username1,
            @RequestParam String username2) {

        // Βρες τους χρήστες από τα usernames
        User user1 = userRepository.findByUsername(username1)
                .orElseThrow(() -> new RuntimeException("User " + username1 + " not found"));
        User user2 = userRepository.findByUsername(username2)
                .orElseThrow(() -> new RuntimeException("User " + username2 + " not found"));

        // Επιστροφή της λίστας DTOs
        return ResponseEntity.ok(chatMessageService.getConversation(user1, user2));
    }
}