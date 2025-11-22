package com.org.mes.io.Mes.io.repository;

import com.org.mes.io.Mes.io.entity.Friends;
import com.org.mes.io.Mes.io.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FriendsRepository extends JpaRepository<Friends,Long> {
    List<Friends> findByUser1OrUser2(User user1, User user2);
}
