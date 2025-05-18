import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

const socket = io("https://peerchatapp.onrender.com");

export default function ChatApp() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [agree, setAgree] = useState(false);
  const [paired, setPaired] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    socket.on("paired", ({ partnerName }) => {
      setPartnerName(partnerName);
      setPaired(true);
    });

    socket.on("waiting", () => {
      console.log("⏳ Waiting for partner...");
    });

    socket.on("chatMessage", ({ sender, text }) => {
      setMessages((prev) => [
        ...prev,
        { sender, text, time: new Date().toLocaleTimeString() },
      ]);
    });

    socket.on("partnerDisconnected", () => {
      alert("Partner disconnected or skipped.");
      setPaired(false);
      setMessages([]);
      setIsPartnerTyping(false);
    });

    socket.on("typing", () => {
      setIsPartnerTyping(true);
    });

    socket.on("stopTyping", () => {
      setIsPartnerTyping(false);
    });

    socket.on("liveCount", (count) => {
      setLiveCount(count);
    });

    return () => {
      socket.off("paired");
      socket.off("waiting");
      socket.off("chatMessage");
      socket.off("partnerDisconnected");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("liveCount");
    };
  }, []);

  const handleStart = () => {
    if (!username.trim()) return alert("Please enter your name");
    if (!agree) return alert("Please agree to the guidelines");
    socket.emit("join", { username });
    setConnected(true);
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chatMessage", { text: input });
      setMessages((prev) => [
        ...prev,
        { sender: "You", text: input, time: new Date().toLocaleTimeString() },
      ]);
      setInput("");
      socket.emit("stopTyping");
    }
  };

  const handleSkip = () => {
    socket.emit("skip");
    setPaired(false);
    setMessages([]);
    setIsPartnerTyping(false);
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (e.target.value.trim()) {
      socket.emit("typing");
    } else {
      socket.emit("stopTyping");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-blue-900 p-4 text-white">
      {!connected ? (
        <motion.div
          className="bg-gray-800 w-full max-w-sm p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-xl font-bold mb-4 text-center">🎓 Peer Chat</h2>
          
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-2 mb-3 bg-gray-700 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="flex items-center mb-3 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mr-2"
            />
            I have read the guidelines and agree to follow them.
          </label>
          <button
            onClick={handleStart}
            className={`w-full py-2 rounded text-white ${
              agree
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!agree}
          >
            Start Chatting
          </button>
          <p className="text-xs text-red-300 text-center mt-3">
            🚫 Don’t spam, abuse, or misbehave. Be respectful to everyone.
          </p>
        </motion.div>
      ) : !paired ? (
        <div className="text-center">
          <div className="loader w-10 h-10 mx-auto mb-4 rounded-full border-4 border-t-white border-gray-400 animate-spin" />
          <p className="text-lg">Searching for a peer...</p>
        </div>
      ) : (
        <div className="bg-gray-900 w-full max-w-md rounded-lg p-4 shadow-md flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Chatting with: {partnerName}</h2>
            <button
              onClick={handleSkip}
              className="text-xs text-red-400 hover:underline"
            >
              Skip
            </button>
          </div>

          <div className="flex-1 overflow-y-auto h-80 space-y-2 mb-4 pr-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                    msg.sender === "You" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] text-gray-300 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
            {isPartnerTyping && (
              <p className="text-xs text-gray-400 italic ml-2">Typing...</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              className="flex-1 px-3 py-2 rounded bg-gray-700 text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-white text-black px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
