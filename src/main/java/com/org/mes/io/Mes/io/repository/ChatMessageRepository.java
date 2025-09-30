package com.org.mes.io.Mes.io.repository;

import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
    List<ChatMessage> findBySenderAndReceiver(User sender, User receiver);
    List<ChatMessage> findByReceiverAndSender(User receiver, User sender);
}
