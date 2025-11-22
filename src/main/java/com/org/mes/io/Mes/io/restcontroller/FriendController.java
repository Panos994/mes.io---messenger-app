package com.org.mes.io.Mes.io.restcontroller;

import com.org.mes.io.Mes.io.entity.FriendRequests;
import com.org.mes.io.Mes.io.entity.User;
import com.org.mes.io.Mes.io.repository.UserRepository;
import com.org.mes.io.Mes.io.securityconfig.JwtUtil;
import com.org.mes.io.Mes.io.service.FriendsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendsService friendRequestService;

    @PostMapping("/send")
    public ResponseEntity<String> sendRequest(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> body) {
        String email = body.get("email");
        friendRequestService.sendFriendRequest(token, email);
        return ResponseEntity.ok("Friend request sent");
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FriendRequests>> pendingRequests(
            @RequestHeader("Authorization") String token){
        return ResponseEntity.ok(friendRequestService.getPendingRequests(token));
    }

    @PostMapping("/accept/{id}")
    public ResponseEntity<String> accept(@PathVariable Long id){
        friendRequestService.acceptRequest(id);
        return ResponseEntity.ok("Accepted");
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<String> reject(@PathVariable Long id){
        friendRequestService.rejectRequest(id);
        return ResponseEntity.ok("Rejected");
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<User>> acceptedFriends(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(friendRequestService.getAcceptedFriends(token));
    }

}

