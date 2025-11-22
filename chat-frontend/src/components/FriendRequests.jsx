import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:9090/api/friends/pending",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRequests(res.data);
  };

  const accept = async (id) => {
    await axios.post(`http://localhost:9090/api/friends/accept/${id}`);
    loadRequests();
  };

  const reject = async (id) => {
    await axios.post(`http://localhost:9090/api/friends/reject/${id}`);
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pending Friend Requests</h2>

      {requests.length === 0 && <p>No pending requests.</p>}

      {requests.map((req) => (
        <div key={req.id}>
          <p>From: {req.sender.email}</p>
          <button onClick={() => accept(req.id)}>Accept</button>
          <button onClick={() => reject(req.id)}>Reject</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
