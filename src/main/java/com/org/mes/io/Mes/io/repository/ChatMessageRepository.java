package com.org.mes.io.Mes.io.repository;

import com.org.mes.io.Mes.io.entity.ChatMessage;
import com.org.mes.io.Mes.io.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {

    // Τροποποίηση: Πρόσθεσε 'OrderByTimestampAsc'
    List<ChatMessage> findBySenderAndReceiverOrderByTimestampAsc(User sender, User receiver);

    // Τροποποίηση: Πρόσθεσε 'OrderByTimestampAsc'
    List<ChatMessage> findByReceiverAndSenderOrderByTimestampAsc(User receiver, User sender);
}
