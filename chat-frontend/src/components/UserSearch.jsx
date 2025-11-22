import React, { useState } from "react";
import api from "../api/axios";

export default function UserSearch({ onRequestSent }) {
  const [email, setEmail] = useState("");
  const [found, setFound] = useState(null);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/search?email=${encodeURIComponent(email)}`);
      setFound(res.data);
    } catch (err) {
      setFound(null);
      alert("User not found");
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async () => {
    if (!found) return;
    try {
      await api.post(`/friends/request/${found.id}`);
      alert("Friend request sent");
      setFound(null);
      setEmail("");
      if (onRequestSent) onRequestSent();
    } catch (err) {
      console.error(err);
      alert("Error sending request");
    }
  };

  return (
    <div className="p-3 border rounded">
      <h4 className="font-semibold mb-2">Find by email</h4>
      <div className="flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="border p-2 flex-1 rounded"
        />
        <button onClick={doSearch} className="bg-blue-600 text-white px-3 rounded">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {found && (
        <div className="mt-3 p-2 border rounded bg-gray-50">
          <div className="font-medium">{found.username}</div>
          <div className="text-sm text-gray-600">{found.email}</div>
          <button onClick={sendRequest} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
            Send Friend Request
          </button>
        </div>
      )}
    </div>
  );
}
