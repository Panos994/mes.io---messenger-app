package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    private final ChatMessageService chatMessageService;


    public ChatController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }


    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestParam User sender,
            @RequestParam User receiver,
            @RequestParam String content) {
        return ResponseEntity.ok(chatMessageService.sendMessage(sender, receiver, content));
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<ChatMessage>> getConversation(@RequestParam User user1, @RequestParam User user2) {
        return ResponseEntity.ok(chatMessageService.getConversation(user1, user2));
    }
}
