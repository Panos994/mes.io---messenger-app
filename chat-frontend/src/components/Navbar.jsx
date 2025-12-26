import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.logo}>Mes.io</span>

        <Link style={styles.link} to="/chat">Chat</Link>
        <Link style={styles.link} to="/search">Search</Link>
        <Link style={styles.link} to="/requests">Requests</Link>
        <Link style={styles.link} to="/friends">Friends</Link>
      </div>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    height: "60px",
    backgroundColor: "#202225",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    boxShadow: "0 1px 0 rgba(0,0,0,0.2)"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  logo: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "18px",
    marginRight: "20px"
  },
  link: {
    color: "#b9bbbe",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500
  },
  logout: {
    background: "#ed4245",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: 500
  }
};
