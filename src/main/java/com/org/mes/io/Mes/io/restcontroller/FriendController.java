package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.Friends;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.service.FriendsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final FriendsService friendsService;


    public FriendController(FriendsService friendsService) {
        this.friendsService = friendsService;
    }

    @PostMapping("/request")
    public ResponseEntity<FriendRequests> sendRequest(@RequestParam User sender, @RequestParam User receiver) {
        return ResponseEntity.ok(friendsService.sendRequest(sender, receiver));
    }
    @PostMapping("/response/{id}")
    public ResponseEntity<FriendRequests> response(@PathVariable Long id, @RequestParam boolean accept) {
        return ResponseEntity.ok(friendsService.respondToRequest(id,accept));
    }
    @GetMapping("/list")
    public ResponseEntity<List<Friends>> listFriends(@RequestParam User user) {
        return ResponseEntity.ok(friendsService.listFriends(user));
    }
}
