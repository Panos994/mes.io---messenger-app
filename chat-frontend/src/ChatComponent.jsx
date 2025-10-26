import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // <-- ΝΕΑ ΕΙΣΑΓΩΓΗ

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_BASE_URL = "http://localhost:8080";

const ChatComponent = () => {
  const [sender, setSender] = useState(""); // Το username του συνδεδεμένου χρήστη
  const [receiver, setReceiver] = useState(""); // Το username του παραλήπτη (που επιλέγεται)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]); // <-- ΝΕΟ STATE: Λίστα χρηστών
  const stompClientRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate(); // <-- ΝΕΟ HOOK

  // 1. useEffect για αρχικοποίηση κατά τη φόρτωση
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Αν δεν υπάρχει token, στείλε τον χρήστη στο login
    if (!token) {
      navigate("/");
      return;
    }

    try {
      // 2. Αποκωδικοποίησε το token για να πάρεις το username (subject)
      const decodedToken = jwtDecode(token);
      const currentUsername = decodedToken.sub;
      setSender(currentUsername);

      // 3. Φέρε τη λίστα των άλλων χρηστών
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/users/all`, {
            headers: {
              Authorization: `Bearer ${token}`, // Στείλε το token για έλεγχο
            },
          });
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
             navigate("/"); // Token έληξε ή είναι άκυρο
          }
        }
      };

      fetchUsers();
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  // 4. useEffect που συνδέεται στο WebSocket ΜΟΝΟ όταν έχουμε το username (sender)
  useEffect(() => {
    if (sender) {
      connect();
    }
    // eslint-disable-next-line
  }, [sender]);

  // 5. useEffect για φόρτωση ιστορικού συνομιλίας όταν αλλάζει ο παραλήπτης
  useEffect(() => {
    const fetchConversation = async (receiverUsername) => {
      const token = localStorage.getItem("token");
      if (!sender || !receiverUsername || !token) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/messages/conversation`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              username1: sender,
              username2: receiverUsername,
            },
          }
        );
        // ΣΗΜΕΙΩΣΗ: Αυτό προϋποθέτει ότι το backend επιστρέφει DTOs
        // με τη μορφή { sender: "...", receiver: "...", content: "..." }
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setMessages([]); // Άδειασε σε περίπτωση σφάλματος
      }
    };

    if (receiver) {
      fetchConversation(receiver);
    } else {
      setMessages([]); // Αν δεν έχει επιλεγεί παραλήπτης, άδειασε τα μηνύματα
    }
  }, [receiver, sender]); // Τρέξε ξανά αν αλλάξει ο sender ή ο receiver


  // 6. useEffect για auto-scroll (παρέμεινε ίδιο)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // connect() - Παρέμεινε σχεδόν ίδιο
  const connect = () => {
    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected");
        stompClient.subscribe(`/user/${sender}/queue/messages`, (msg) => {
          const msgBody = JSON.parse(msg.body);

          // Εμφάνισε το μήνυμα μόνο αν είναι από/προς τον επιλεγμένο χρήστη
          setMessages((prev) => [...prev, msgBody]);
          // *Προχωρημένη σκέψη:* Ίσως θες να το δείχνεις
          // μόνο αν `msgBody.sender === receiver`
        });
      },
    });
    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  // sendMessage() - Παρέμεινε σχεδόν ίδιο
  const sendMessage = () => {
    if (!stompClientRef.current || !stompClientRef.current.connected) return;
    if (!message.trim() || !receiver.trim()) return; // `receiver` έρχεται πλέον από το state

    const chatMessage = { sender, receiver, content: message };

    stompClientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(chatMessage),
    });

    setMessages((prev) => [...prev, chatMessage]);
    setMessage("");
  };

  // --- ΝΕΟ UI ---
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "900px", // Αυξήθηκε το πλάτος
        margin: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Header - Τροποποιημένο */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#0078ff",
          color: "white",
          padding: "10px 20px",
        }}
      >
        <h3 style={{ margin: 0 }}>Chat App</h3>
        {sender && (
          <span style={{ fontSize: "0.9em" }}>
            Welcome, <strong>{sender}</strong>
          </span>
        )}
      </div>

      {/* Κύριο Περιεχόμενο (Λίστα Χρηστών + Chat) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Πλαϊνή μπάρα χρηστών */}
        <div
          style={{
            width: "200px",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            background: "#f7f7f7",
          }}
        >
          <h4
            style={{
              padding: "10px",
              margin: 0,
              borderBottom: "1px solid #ddd",
              background: "#eee",
            }}
          >
            Users
          </h4>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setReceiver(user.username)}
              style={{
                padding: "12px 15px",
                cursor: "pointer",
                background:
                  receiver === user.username ? "#d0e7ff" : "transparent",
                fontWeight: receiver === user.username ? "bold" : "normal",
                borderBottom: "1px solid #eee",
              }}
            >
              {user.username}
            </div>
          ))}
        </div>

        {/* Κύριο παράθυρο Chat */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Μηνύματα */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              background: "#f9f9f9",
            }}
          >
            {/* Έλεγχος αν έχει επιλεγεί παραλήπτης */}
            {!receiver ? (
               <div style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>
                 Select a user to start chatting.
               </div>
            ) : (
              messages.map((msg, idx) => {
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
                      {/* Δεν χρειάζεται να δείχνουμε το όνομα σε κάθε μήνυμα
                          αφού ξέρουμε με ποιον μιλάμε, αλλά το αφήνω
                          αν το ιστορικό φέρνει και τα 2 ονόματα */}
                      <strong style={{ fontSize: "0.8em", display: 'block', opacity: 0.7 }}>
                        {msg.sender}
                      </strong>
                      <div>{msg.content}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box - Εμφανίζεται μόνο αν έχει επιλεγεί receiver */}
          {receiver && (
            <div
              style={{
                display: "flex",
                borderTop: "1px solid #ddd",
                padding: "10px",
              }}
            >
              <input
                style={{ flex: 1, padding: "8px" }}
                placeholder={`Message ${receiver}...`}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;