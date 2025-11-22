package com.org.mes.io.Mes.io.service;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.Friends;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.FriendRequestsRepository;
import com.org.mes.io.Mes.io.repository.FriendsRepository;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.securityconfig.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendsService {

    private final UserRepository userRepository;
    private final FriendRequestsRepository friendRequestRepository;
    private final JwtUtil jwtUtil;

    public void sendFriendRequest(String token, String receiverEmail) {
        String senderUsername = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (friendRequestRepository.existsBySenderAndReceiver(sender, receiver)) {
            throw new RuntimeException("Request already exists");
        }

        FriendRequests fr = new FriendRequests();
        fr.setSender(sender);
        fr.setReceiver(receiver);
        fr.setStatus(FriendRequests.RequestStatus.PENDING);

        friendRequestRepository.save(fr);
    }

    public List<FriendRequests> getPendingRequests(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User receiver = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return friendRequestRepository.findByReceiverAndStatus(receiver, FriendRequests.RequestStatus.PENDING);
    }

    public void acceptRequest(Long requestId) {
        FriendRequests fr = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        fr.setStatus(FriendRequests.RequestStatus.ACCEPTED);
        friendRequestRepository.save(fr);
    }

    public void rejectRequest(Long requestId) {
        FriendRequests fr = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        fr.setStatus(FriendRequests.RequestStatus.REJECTED);
        friendRequestRepository.save(fr);
    }
    public List<User> getAcceptedFriends(String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User me = userRepository.findByUsername(username).orElseThrow();

        List<FriendRequests> accepted = friendRequestRepository
                .findByReceiverAndStatus(me, FriendRequests.RequestStatus.ACCEPTED);

        return accepted.stream().map(FriendRequests::getSender).toList();
    }

}