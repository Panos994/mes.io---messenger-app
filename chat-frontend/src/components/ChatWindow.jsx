import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function ChatWindow({ friend, currentUsername, stompClientRef }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/messages/conversation", {
          params: { username1: currentUsername, username2: friend.username }
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    };
    if (friend) load();
  }, [friend, currentUsername]);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = () => {
    if (!text.trim()) return;
    const msg = { sender: currentUsername, receiver: friend.username, content: text };
    // publish via stompClientRef (passed from parent)
    if (stompClientRef?.current?.publish) {
      stompClientRef.current.publish({ destination: "/app/chat.send", body: JSON.stringify(msg) });
    } else {
      // fallback to REST send
      api.post("/messages/send", { sender: currentUsername, receiver: friend.username, content: text }).catch(console.error);
    }
    setMessages(prev => [...prev, msg]);
    setText("");
  };

  return (
    <div className="h-full flex flex-col border rounded p-3 bg-white">
      <div className="font-semibold mb-2">Chat with {friend.username}</div>
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50 rounded">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.sender === currentUsername ? "text-right" : ""}`}>
            <div className={`inline-block p-2 rounded ${m.sender === currentUsername ? "bg-blue-200" : "bg-gray-200"}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>

      <div className="mt-2 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={(e)=> e.key==="Enter" && send()} className="flex-1 border p-2 rounded" placeholder={`Message ${friend.username}`} />
        <button onClick={send} className="bg-blue-600 text-white rounded px-3">Send</button>
      </div>
    </div>
  );
}
