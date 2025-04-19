import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import ChatPage from "./pages/ChatPage";
import AboutPage from "./pages/AboutPage";
import FormPage from "./pages/FormPage";
import LandingPage from "./pages/LandingPage";
import UniversalSidebar from "./components/UniversalSidebar";
import { ChatProvider } from "./components/ChatContext";
import { ModelEndpointProvider } from "./components/ModelEndpointContext";
import { AuthProvider } from "./components/AuthContext";
import AuthModal from "./components/AuthModal";
import "./App.css";

const App = () => {
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
