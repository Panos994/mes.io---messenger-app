package com.org.mes.io.Mes.io.repository;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FriendRequestsRepository extends JpaRepository <FriendRequests,Long>{
    List<FriendRequests> findByReceiverAndStatus(User receiver, FriendRequests.RequestStatus status);

    List<FriendRequests> findBySender(User sender);

    boolean existsBySenderAndReceiver(User sender, User receiver);
}
