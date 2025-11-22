import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  const loadFriends = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:9090/api/friends/accepted",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFriends(res.data);
  };

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Friends</h2>

      {friends.length === 0 && <p>You have no friends yet.</p>}

      <ul>
        {friends.map((f) => (
          <li key={f.id}>{f.email}</li>
        ))}
      </ul>
    </div>
  );
}
