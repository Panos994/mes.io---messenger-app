package com.org.mes.io.Mes.io.controller;

import com.org.mes.io.Mes.io.dto.ChatMessageDto;
import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.ChatMessageRepository;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.service.ChatMessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatService;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    public WebSocketChatController(SimpMessagingTemplate messagingTemplate, ChatMessageService chatService, UserRepository userRepository, ChatMessageRepository chatMessageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDto dto) {
        // Βρες τους users από τη βάση
        User sender = userRepository.findByUsername(dto.getSender())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findByUsername(dto.getReceiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage chatMessage = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(dto.getContent())
                .build();

        chatMessageRepository.save(chatMessage);

        messagingTemplate.convertAndSendToUser(
                receiver.getUsername(),
                "/queue/messages",
                dto
        );
    }
}
