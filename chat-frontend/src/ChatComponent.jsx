import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
//const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080';
const ChatComponent = () => {
    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const stompClientRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (sender) connect();
        // eslint-disable-next-line
    }, [sender]);

    useEffect(() => {
        // scroll auto-bottom όταν μπαίνει νέο μήνυμα
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const connect = () => {
        const socket = new SockJS(`${API_BASE_URL}/ws`); //"http://localhost:8080/ws"
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected");
                stompClient.subscribe(`/user/${sender}/queue/messages`, (msg) => {
                    const msgBody = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, msgBody]);
                });
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
    };

    const sendMessage = () => {
        if (!stompClientRef.current || !stompClientRef.current.connected) return;
        if (!message.trim() || !receiver.trim()) return;

        const chatMessage = { sender, receiver, content: message };

        // publish στο server
        stompClientRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(chatMessage),
        });

        // πρόσθεσε και στο local state (για να φαίνεται άμεσα)
        setMessages((prev) => [...prev, chatMessage]);
        setMessage("");
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                maxWidth: "600px",
                margin: "auto",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: "#0078ff",
                    color: "white",
                    padding: "10px",
                    textAlign: "center",
                }}
            >
                <h3 style={{ margin: 0 }}>Chat App</h3>
            </div>

            {/* User Inputs */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                }}
            >
                <input
                    style={{ flex: 1, padding: "5px" }}
                    placeholder="Your username"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                />
                <input
                    style={{ flex: 1, padding: "5px" }}
                    placeholder="Receiver username"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                />
            </div>

            {/* Messages */}
            <div
                style={{
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                    background: "#f9f9f9",
                }}
            >
                {messages.map((msg, idx) => {
                    const isMine = msg.sender === sender;
                    return (
                        <div
                            key={idx}
                            style={{
                                display: "flex",
                                justifyContent: isMine ? "flex-end" : "flex-start",
                                marginBottom: "10px",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "70%",
                                    padding: "8px 12px",
                                    borderRadius: "15px",
                                    background: isMine ? "#0078ff" : "#e5e5ea",
                                    color: isMine ? "white" : "black",
                                }}
                            >
                                <strong style={{ fontSize: "0.8em" }}>
                                    {msg.sender}
                                </strong>
                                <div>{msg.content}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <div
                style={{
                    display: "flex",
                    borderTop: "1px solid #ddd",
                    padding: "10px",
                }}
            >
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
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
