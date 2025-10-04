import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/auth/register";

const SignUpPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, { username, email, password });
            alert("User created! You can login now.");
            navigate("/");
        } catch (err) {
            alert("Error creating user");
        }
    };

    return (
        <div style={{ margin: "100px auto", width: "300px", textAlign: "center" }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br/>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br/>
                <button type="submit">Sign Up</button>
            </form>
            <p onClick={() => navigate("/")} style={{ cursor: "pointer", color: "blue" }}>
                Already have an account? Login
            </p>
        </div>
    );
};

export default SignUpPage;
