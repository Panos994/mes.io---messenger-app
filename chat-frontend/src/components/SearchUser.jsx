import React, { useState } from "react";
import axios from "axios";

export default function SearchUser() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const sendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:9090/api/friends/send",
        { email }, // <-- στέλνουμε email στο body
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMsg("Friend request sent!");
    } catch (err) {
      console.error(err);
      setMsg("Error sending request.");
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Search User by Email</h2>

      <input
        type="text"
        placeholder="Enter email…"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={sendRequest}>Send Friend Request</button>

      <p>{msg}</p>
    </div>
  );
}
