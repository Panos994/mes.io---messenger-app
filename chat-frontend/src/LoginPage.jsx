import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/auth/login";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log("Login clicked directly!");
        try {
            console.log("Trying to login with:", email, password);

            const res = await axios.post(API_URL, { email, password });
            console.log("Response:", res.data);
            localStorage.setItem("token", res.data.token);
            navigate("/chatComponent");
        } catch (err) {
            console.error("Login error:", err);
            alert("Invalid credentials");
        }
    };


    return (
        <div style={{ margin: "100px auto", width: "300px", textAlign: "center" }}>
            <h2>Login</h2>
            {/*<form onSubmit={handleLogin}>*/}
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
            <button type="submit" onClick={handleLogin}>Login</button>


            {/*</form>*/}
            <p onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: "blue" }}>
                Don’t have an account? Sign up
            </p>
        </div>
    );
};

export default LoginPage;
