import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      padding: "10px",
      display: "flex",
      gap: "20px",
      background: "#f0f0f0"
    }}>
      <Link to="/chat">Chat</Link>
      <Link to="/search">Search Users</Link>
      <Link to="/requests">Friend Requests</Link>
      <Link to="/friends">My Friends</Link>
    </nav>
  );
}
