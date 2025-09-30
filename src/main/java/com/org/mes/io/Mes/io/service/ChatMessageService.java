package com.org.mes.io.Mes.io.service;

import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepo;

    public ChatMessageService(ChatMessageRepository chatMessageRepo) {
        this.chatMessageRepo = chatMessageRepo;
    }

    public ChatMessage sendMessage(User sender, User receiver, String content) {
        ChatMessage msg = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();
        return chatMessageRepo.save(msg);
    }
    public List<ChatMessage> getConversation(User user1, User user2) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.addAll(chatMessageRepo.findBySenderAndReceiver(user1, user2));
        messages.addAll(chatMessageRepo.findByReceiverAndSender(user1, user2));
        return messages;
    }
}
