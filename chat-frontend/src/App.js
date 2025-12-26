import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import SearchUser from "./components/SearchUser";
import FriendRequests from "./components/FriendRequests";
import FriendsList from "./components/FriendsList";
import ChatComponent from "./components/ChatComponent";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/chat" element={<ChatComponent />} />
        <Route path="/search" element={<SearchUser />} />
        <Route path="/requests" element={<FriendRequests />} />
        <Route path="/friends" element={<FriendsList />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
