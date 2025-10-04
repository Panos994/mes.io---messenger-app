// import React from "react";
// import ChatComponent from "./ChatComponent";
//
// function App() {
//     return (
//         <div>
//             <h1>React Chat App</h1>
//             <ChatComponent />
//         </div>
//     );
// }
//
// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import ChatPage from "./ChatPage";
import ChatComponent from "./ChatComponent";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chatComponent" element={<ChatComponent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
