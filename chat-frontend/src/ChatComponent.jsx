import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:8080";

const ChatComponent = () => {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const stompClientRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // --------------------------
  // 1) LOAD LOGGED USER + USERS
  // --------------------------

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const username = decoded.sub; // subject
      setSender(username);

      const fetchUsers = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/users/all`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data);
        } catch (err) {
          console.error("Error fetching users:", err);
          navigate("/");
        }
      };

      fetchUsers();
    } catch (e) {
      console.error("TOKEN ERROR:", e);
      navigate("/");
    }
  }, [navigate]);

  // --------------------------
  // 2) CONNECT TO WEBSOCKET
  // --------------------------

  useEffect(() => {
    if (!sender) return;

    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        console.log("Connected to WS");

        stompClient.subscribe(`/user/${sender}/queue/messages`, (msg) => {
          const body = JSON.parse(msg.body);

          setMessages((prev) => [...prev, body]);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => stompClient.deactivate();
  }, [sender]);

  // --------------------------------------------
  // 3) LOAD MESSAGE HISTORY WHEN USER IS SELECTED
  // --------------------------------------------

  useEffect(() => {
    if (!receiver || !sender) {
      setMessages([]);
      return;
    }

    const token = localStorage.getItem("token");

    const loadHistory = async () => {
      try {
        const resp = await axios.get(
          `${API_BASE_URL}/api/messages/conversation`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              username1: sender,
              username2: receiver,
            },
          }
        );

        setMessages(resp.data);
      } catch (err) {
        console.error("Conversation fetch error:", err);
      }
    };

    loadHistory();
  }, [receiver, sender]);

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --------------------------
  // 4) SEND MESSAGE
  // --------------------------

  const sendMessage = () => {
    if (!message.trim() || !receiver.trim()) return;

    const msgObj = {
      sender,
      receiver,
      content: message,
    };

    stompClientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(msgObj),
    });

    setMessages((prev) => [...prev, msgObj]);
    setMessage("");
  };

  // --------------------------
  // UI
  // --------------------------

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "900px",
        margin: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          background: "#0078ff",
          padding: "10px 20px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Chat App</h2>
        <span>Logged in as: <b>{sender}</b></span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* USERS LIST */}
        <div
          style={{
            width: "220px",
            borderRight: "1px solid #ddd",
            background: "#f0f0f0",
            overflowY: "auto",
          }}
        >
          <h4 style={{ padding: "10px", margin: 0, background: "#ddd" }}>
            Users
          </h4>

          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => setReceiver(u.username)}
              style={{
                padding: "12px",
                cursor: "pointer",
                background:
                  receiver === u.username ? "#b7d7ff" : "transparent",
                borderBottom: "1px solid #ccc",
              }}
            >
              {u.username}
            </div>
          ))}
        </div>

        {/* CHAT WINDOW */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              background: "#fafafa",
            }}
          >
            {!receiver ? (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                Select a user to chat.
              </div>
            ) : (
              messages.map((msg, idx) => {
                const mine = msg.sender === sender;

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: mine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        background: mine ? "#0078ff" : "#e1e1e1",
                        color: mine ? "white" : "black",
                        borderRadius: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      {!mine && (
                        <div
                          style={{
                            fontSize: "0.7em",
                            opacity: 0.7,
                            marginBottom: "3px",
                          }}
                        >
                          {msg.sender}
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* INPUT */}
          {receiver && (
            <div style={{ display: "flex", padding: "10px" }}>
              <input
                style={{ flex: 1, padding: "8px" }}
                value={message}
                placeholder={`Message ${receiver}...`}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: "10px",
                  padding: "10px 15px",
                  background: "#0078ff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
