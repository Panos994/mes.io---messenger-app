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
        <div style={styles.container}>
            <div style={styles.card}>
                <img src="/chatlogo.png" alt="Gaming Chat Logo" style={styles.logo} /> {/* <-- ΝΕΟ LOGO */}
                <h2 style={styles.title}>Create an account</h2> {/* <-- Τροποποιημένο κείμενο */}
                <p style={styles.subtitle}>Join our chatting community!</p>

                <form onSubmit={handleSignUp}>
                    <div style={styles.formGroup}>
                        <label htmlFor="username" style={styles.label}>USERNAME</label>
                        <input
                            id="username"
                            type="text"
                            placeholder=""
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        /><br/>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>EMAIL</label>
                        <input
                            id="email"
                            type="email"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        /><br/>
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>PASSWORD</label>
                        <input
                            id="password"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        /><br/>
                    </div>

                    <button type="submit" style={styles.button}>
                        Sign Up
                    </button>
                </form>

                <p style={styles.signupText}>
                    Already have an account?{" "}
                    <span onClick={() => navigate("/")} style={styles.signupLink}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

// --- STYLES (ίδια με του LoginPage για συνέπεια) ---
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#36393f",
        fontFamily: "Whitney, Helvetica Neue, Helvetica, Arial, sans-serif",
    },
    card: {
        backgroundColor: "#303136",
        padding: "40px",
        borderRadius: "8px",
        width: "400px",
        textAlign: "center",
        boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.2)",
    },
    logo: {
        width: "80px",
        height: "80px",
        marginBottom: "20px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #7289da",
    },
    title: {
        color: "#fff",
        fontSize: "24px",
        fontWeight: 600,
        marginBottom: "8px",
    },
    subtitle: {
        color: "#b9bbbe",
        fontSize: "16px",
        marginBottom: "20px",
    },
    formGroup: {
        textAlign: "left",
        marginBottom: "15px",
    },
    label: {
        display: "block",
        color: "#b9bbbe",
        fontSize: "12px",
        fontWeight: 600,
        marginBottom: "8px",
        textTransform: "uppercase",
    },
    input: {
        width: "calc(100% - 20px)",
        padding: "10px",
        backgroundColor: "#202225",
        border: "1px solid #202225",
        borderRadius: "4px",
        color: "#dcddde",
        fontSize: "16px",
        outline: "none",
        transition: "border-color 0.2s ease-in-out",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#7289da",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        marginTop: "20px",
        transition: "background-color 0.2s ease-in-out",
    },
    signupText: {
        color: "#b9bbbe",
        fontSize: "14px",
        marginTop: "20px",
    },
    signupLink: {
        color: "#00aff4",
        cursor: "pointer",
        fontWeight: 500,
    },
};

export default SignUpPage;