import React, { useState } from "react";
import ChatComponent from "./ChatComponent";
import FriendRequests from "./FriendRequests";
import FindFriends from "./FindFriends";

export default function ChatPage() {
    const [activeTab, setActiveTab] = useState("chat");

    return (
        <div style={{ display: "flex", height: "100vh", background: "#2F3136" }}>

            {/* Sidebar */}
            <div style={{
                width: "220px",
                background: "#202225",
                color: "white",
                paddingTop: "20px"
            }}>
                <h3 style={{ textAlign: "center" }}>Menu</h3>

                <div
                    style={menuButton(activeTab === "chat")}
                    onClick={() => setActiveTab("chat")}
                >
                    Chat
                </div>

                <div
                    style={menuButton(activeTab === "requests")}
                    onClick={() => setActiveTab("requests")}
                >
                    Friend Requests
                </div>

                <div
                    style={menuButton(activeTab === "find")}
                    onClick={() => setActiveTab("find")}
                >
                    Find Friends
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, background: "#36393f" }}>
                {activeTab === "chat" && <ChatComponent />}
                {activeTab === "requests" && <FriendRequests />}
                {activeTab === "find" && <FindFriends />}
            </div>

        </div>
    );
}

const menuButton = (active) => ({
    padding: "15px 20px",
    background: active ? "#5865F2" : "transparent",
    cursor: "pointer",
    margin: "10px",
    borderRadius: "6px",
    textAlign: "center",
    fontWeight: active ? "bold" : "normal"
});
