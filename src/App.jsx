// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import ChatPage from "./pages/ChatPage";
import AboutPage from "./pages/AboutPage";
import FormPage from "./pages/FormPage";
import LandingPage from "./pages/LandingPage";
import { ChatProvider } from "./components/ChatContext";
import { ModelEndpointProvider } from "./components/ModelEndpointContext";
import { AuthProvider } from "./components/AuthContext";
import AuthModal from "./components/AuthModal";
import { useInitGoogleLogin } from "./auth/token";
import "./App.css";

const App = () => {
  const login = useInitGoogleLogin();

  useEffect(() => {
    // On first load, if we don't have a token yet, pop the Google Sign‑In dialog
    if (!sessionStorage.getItem("id_token")) {
      login();
    }
  }, [login]);

  return (
    <ChatProvider>
      <AuthProvider>
        <ModelEndpointProvider>
          <Router>
            <AuthModal />
            <div className="h-screen flex flex-col">
              <TopBar />
              <div className="flex-1">
                <Routes>
                  <Route path="rtk-frontend/" element={<LandingPage />} />
                  <Route path="rtk-frontend/form" element={<FormPage />} />
                  <Route path="rtk-frontend/about" element={<AboutPage />} />
                  <Route path="rtk-frontend/chat" element={<ChatPage />} />
                </Routes>
              </div>
            </div>
          </Router>
        </ModelEndpointProvider>
      </AuthProvider>
    </ChatProvider>
  );
};

export default App;
