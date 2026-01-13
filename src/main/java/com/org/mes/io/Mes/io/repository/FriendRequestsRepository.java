package com.org.mes.io.Mes.io.repository;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FriendRequestsRepository extends JpaRepository <FriendRequests,Long>{
    List<FriendRequests> findByReceiverAndStatus(User receiver, FriendRequests.RequestStatus status);

    List<FriendRequests> findBySender(User sender);

    boolean existsBySenderAndReceiver(User sender, User receiver);

        @Query("""
        SELECT COUNT(fr) > 0
        FROM FriendRequests fr
        WHERE 
        (
            (fr.sender = :u1 AND fr.receiver = :u2)
            OR
            (fr.sender = :u2 AND fr.receiver = :u1)
        )
        AND fr.status = 'ACCEPTED'
    """)
        boolean areFriends(@Param("u1") User u1, @Param("u2") User u2);
}


