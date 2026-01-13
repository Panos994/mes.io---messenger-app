package com.org.mes.io.Mes.io.service;

import com.org.mes.io.Mes.io.dto.ChatMessageDto;
import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.ChatMessageRepository;
import com.org.mes.io.Mes.io.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepo;
    // Πιθανότατα θα χρειαστείς και το UserRepository εδώ
    private final UserRepository userRepository;

    // Τροποποίησε τον constructor
    public ChatMessageService(ChatMessageRepository chatMessageRepo, UserRepository userRepository) {
        this.chatMessageRepo = chatMessageRepo;
        this.userRepository = userRepository;
    }

    public ChatMessage sendMessage(User sender, User receiver, String content) {
        ChatMessage msg = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();
        return chatMessageRepo.save(msg);
    }

    // Τροποποίηση: Άλλαξε τον τύπο επιστροφής σε List<ChatMessageDto>
    public List<ChatMessageDto> getConversation(User user1, User user2) {
        // Χρησιμοποίησε τις νέες μεθόδους του repository
        List<ChatMessage> messagesFrom1To2 = chatMessageRepo.findBySenderAndReceiverOrderByTimestampAsc(user1, user2);
        List<ChatMessage> messagesFrom2To1 = chatMessageRepo.findBySenderAndReceiverOrderByTimestampAsc(user2, user1);

        List<ChatMessage> allMessages = new ArrayList<>();
        allMessages.addAll(messagesFrom1To2);
        allMessages.addAll(messagesFrom2To1);

        // Ταξινόμησε την τελική λίστα (αφού συνδυάστηκαν οι 2 λίστες)
        allMessages.sort(
                Comparator.comparing(
                        ChatMessage::getTimestamp,
                        Comparator.nullsLast(Comparator.naturalOrder())
                )
        );

        // Μετατροπή σε DTOs
        return allMessages.stream()
                .map(msg -> ChatMessageDto.builder()
                        .sender(msg.getSender().getUsername())
                        .receiver(msg.getReceiver().getUsername())
                        .content(msg.getContent())
                        .build())
                .collect(Collectors.toList());
    }
}
