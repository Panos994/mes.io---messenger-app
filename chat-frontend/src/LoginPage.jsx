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
        <div style={styles.container}>
            <div style={styles.card}>
                <img src="/chatlogo.png" alt="Gaming Chat Logo" style={styles.logo} /> {/* <-- ΝΕΟ LOGO */}
                <h2 style={styles.title}>Welcome Back!</h2> {/* <-- Τροποποιημένο κείμενο */}
                <p style={styles.subtitle}>We're so excited to see you again!</p>

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
                    />
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
                    />
                </div>

                {/* Forget password link - Προαιρετικό, αλλά συνηθισμένο στο Discord */}
                <p style={styles.forgotPassword}>Forgot your password?</p>

                <button type="submit" onClick={handleLogin} style={styles.button}>
                    Login
                </button>

                <p style={styles.signupText}>
                    Need an account?{" "}
                    <span onClick={() => navigate("/signup")} style={styles.signupLink}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#36393f", // Σκούρο γκρι, όπως το Discord
        fontFamily: "Whitney, Helvetica Neue, Helvetica, Arial, sans-serif",
    },
    card: {
        backgroundColor: "#303136", // Ελαφρώς πιο ανοιχτό γκρι για το "κουτί"
        padding: "40px",
        borderRadius: "8px",
        width: "400px",
        textAlign: "center",
        boxShadow: "0 2px 10px 0 rgba(0, 0, 0, 0.2)",
    },
    logo: {
        width: "80px", // Μέγεθος logo
        height: "80px",
        marginBottom: "20px",
        borderRadius: "50%", // Κυκλικό logo
        objectFit: "cover",
        border: "3px solid #7289da", // Μωβ-μπλε περίγραμμα, όπως το Discord
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
        backgroundColor: "#202225", // Σκούρο input background
        border: "1px solid #202225",
        borderRadius: "4px",
        color: "#dcddde", // Ανοιχτό γκρι κείμενο
        fontSize: "16px",
        outline: "none",
        transition: "border-color 0.2s ease-in-out",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#7289da", // Το χαρακτηριστικό μωβ-μπλε του Discord
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        marginTop: "20px",
        transition: "background-color 0.2s ease-in-out",
    },
    forgotPassword: {
        textAlign: "right",
        color: "#00aff4", // Μπλε για link
        fontSize: "12px",
        cursor: "pointer",
        marginTop: "-10px", // Για να έρθει πιο κοντά στο input
        marginBottom: "15px",
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

export default LoginPage;