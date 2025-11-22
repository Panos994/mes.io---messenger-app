import React, { useState } from "react";
import axios from "axios";

export default function FindFriends() {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);

    const searchUser = async () => {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:9090/api/users/search", {
            params: { email },
            headers: { Authorization: `Bearer ${token}` }
        });

        setResult(res.data);
    };

    const sendRequest = async (userId) => {
        const token = localStorage.getItem("token");

        await axios.post(
            `http://localhost:9090/api/friends/request/${userId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Friend request sent!");
    };

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h2>Find Friends</h2>

            <input
                type="text"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    padding: "10px",
                    width: "300px",
                    borderRadius: "4px"
                }}
            />

            <button
                onClick={searchUser}
                style={{
                    marginLeft: "10px",
                    padding: "10px 15px",
                    cursor: "pointer"
                }}
            >
                Search
            </button>

            {result && (
                <div style={{ marginTop: "20px" }}>
                    <h3>{result.username}</h3>
                    <p>{result.email}</p>

                    <button
                        onClick={() => sendRequest(result.id)}
                        style={{
                            padding: "10px",
                            background: "#7289DA",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            color: "white"
                        }}
                    >
                        Send Friend Request
                    </button>
                </div>
            )}
        </div>
    );
}
