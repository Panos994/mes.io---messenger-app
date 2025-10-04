import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const ChatPage = () => {
    const [currentUser, setCurrentUser] = useState("");
    const [receiver, setReceiver] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const stompClientRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/";
            return;
        }

        const fetchUserData = async () => {
            const username = parseJwt(token).sub;
            setCurrentUser(username);
            connect(username);
            const res = await axios.get(`${API_BASE_URL}/api/users/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data);
        };

        fetchUserData();
    }, []);

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return null;
        }
    };

    const connect = (username) => {
        const socket = new SockJS(`${API_BASE_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.subscribe(`/user/${username}/queue/messages`, (msg) => {
                    const msgBody = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, msgBody]);
                });
            },
        });
        stompClient.activate();
        stompClientRef.current = stompClient;
    };

    const sendMessage = () => {
        if (!stompClientRef.current || !receiver || !message.trim()) return;
        const chatMessage = { sender: currentUser, receiver: receiver.username, content: message };
        stompClientRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(chatMessage),
        });
        setMessages((prev) => [...prev, chatMessage]);
        setMessage("");
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar users */}
            <div style={{ width: "25%", borderRight: "1px solid #ddd", overflowY: "auto", padding: "10px" }}>
                <h3>Users</h3>
                {users.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            padding: "10px",
                            background: receiver?.id === user.id ? "#0078ff" : "#f2f2f2",
                            color: receiver?.id === user.id ? "white" : "black",
                            borderRadius: "5px",
                            marginBottom: "5px",
                            cursor: "pointer",
                        }}
                        onClick={() => setReceiver(user)}
                    >
                        {user.username}
                    </div>
                ))}
            </div>

            {/* Chat area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ background: "#0078ff", color: "white", padding: "10px" }}>
                    {receiver ? receiver.username : "Select a user to chat"}
                </div>
                <div style={{ flex: 1, padding: "10px", overflowY: "auto", background: "#f9f9f9" }}>
                    {messages
                        .filter(
                            (msg) =>
                                (msg.sender === currentUser && msg.receiver === receiver?.username) ||
                                (msg.sender === receiver?.username && msg.receiver === currentUser)
                        )
                        .map((msg, idx) => {
                            const isMine = msg.sender === currentUser;
                            return (
                                <div key={idx} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                                    <div
                                        style={{
                                            background: isMine ? "#0078ff" : "#e5e5ea",
                                            color: isMine ? "white" : "black",
                                            padding: "8px 12px",
                                            borderRadius: "15px",
                                            marginBottom: "5px",
                                            maxWidth: "70%",
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                    <div ref={chatEndRef} />
                </div>

                <div style={{ display: "flex", borderTop: "1px solid #ddd", padding: "10px" }}>
                    <input
                        style={{ flex: 1, padding: "8px" }}
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        style={{
                            marginLeft: "10px",
                            padding: "8px 15px",
                            background: "#0078ff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
