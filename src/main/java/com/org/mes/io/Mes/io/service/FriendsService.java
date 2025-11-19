package com.org.mes.io.Mes.io.service;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.Friends;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.FriendRequestsRepository;
import com.org.mes.io.Mes.io.repository.FriendsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendsService {

    private final FriendsRepository friendsRepository;
    private final FriendRequestsRepository friendRequestsRepository;
    public FriendsService(FriendsRepository friendsRepository, FriendRequestsRepository friendRequestsRepository) {
        this.friendsRepository = friendsRepository;
        this.friendRequestsRepository = friendRequestsRepository;
    }

    public FriendRequests sendRequest(User sender, User receiver){
        FriendRequests request = FriendRequests.builder()
                .sender(sender)
                .receiver(receiver)
                .status(FriendRequests.RequestStatus.PENDING)
                .build();
        return friendRequestsRepository.save(request);

    }

    public FriendRequests respondToRequest(Long requestId, boolean accept) {
        FriendRequests request = friendRequestsRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (accept) {
            request.setStatus(FriendRequests.RequestStatus.ACCEPTED);
            Friends friendship = Friends.builder()
                    .user1(request.getSender())
                    .user2(request.getReceiver())
                    .build();
            friendsRepository.save(friendship);
        } else {
            request.setStatus(FriendRequests.RequestStatus.REJECTED);
        }

        return friendRequestsRepository.save(request);
    }

//    public List<Friends> listFriends(User user) {
//        return friendsRepository.findByUser1OrUser2(user, user);
//    }

    public List<User> listFriendUsers(User user) {
        List<Friends> relations = friendsRepository.findByUser1OrUser2(user, user);

        return relations.stream()
                .map(f -> f.getUser1().equals(user) ? f.getUser2() : f.getUser1())
                .toList();
    }

    public List<FriendRequests> getPendingRequests(User receiver) {
        return friendRequestsRepository.findByReceiverAndStatus(receiver, FriendRequests.RequestStatus.PENDING);
    }

}
