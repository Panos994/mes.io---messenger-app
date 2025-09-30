package com.org.mes.io.Mes.io.repository;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRequestsRepository extends JpaRepository <FriendRequests,Long>{
    List<FriendRequests> findByReceiverAndStatus(User receiver, FriendRequests.RequestStatus status);
}
