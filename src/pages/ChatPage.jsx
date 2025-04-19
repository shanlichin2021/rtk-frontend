import React, { useContext, useState } from "react";
import { ChatContext } from "../components/ChatContext";
import { ModelEndpointContext } from "../components/ModelEndpointContext";
import { HashLoader } from "react-spinners";
import api from "../api"; // <-- use the wrapper, not plain axios

const ChatPage = () => {
  const { messages, addMessage, saveChat } = useContext(ChatContext);
  const { selectedEndpoint } = useContext(ModelEndpointContext);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userEntry = { sender: "user", text: currentMessage };
    addMessage(userEntry);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/chat", {
        history: messages,
        message: currentMessage,
        modelUrl: selectedEndpoint ? selectedEndpoint.url : "",
        modelName: selectedEndpoint ? selectedEndpoint.model : "llama3.2",
      });

      const aiEntry = { sender: "ai", text: response.data.reply };
      addMessage(aiEntry);

      if (messages.length === 0) {
        saveChat([...messages, userEntry, aiEntry]);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 p-4 h-screen bg-[#0f0f0f]">
      <div className="flex flex-col flex-1 pr-12 pl-12 pt-14">
        <div className="flex-1 overflow-auto bg-[#181818] shadow-md rounded-lg p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } my-2`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-[#5c5e49] text-white"
                    : "bg-gray-600 text-white font-mono"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center bottom-0 my-4">
              <HashLoader color="#5c5e49" size={30} />
            </div>
          )}
        </div>

        <div className="flex items-center p-3 mt-2">
          <input
            type="text"
            className="flex-1 p-2 border border-[#2a2a2a] text-white rounded-lg bg-[#0f0f0f]"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="ml-2 px-4 py-2 bg-[#5c5e49] text-white rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
