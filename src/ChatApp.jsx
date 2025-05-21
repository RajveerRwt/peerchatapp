import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";


const socket = io("https://peerchatapp.onrender.com");

export default function ChatApp({ onBack }) {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [agree, setAgree] = useState(false);
  const [paired, setPaired] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("paired", ({ partnerName }) => {
      setPartnerName(partnerName);
      setPaired(true);
    });

    socket.on("waiting", () => console.log("Waiting for partner..."));

    socket.on("chatMessage", ({ sender, text }) => {
      setMessages((prev) => [
        ...prev,
        { sender, text, time: new Date().toLocaleTimeString() },
      ]);
    });

    socket.on("partnerDisconnected", () => {
      alert("Partner disconnected.");
      setPaired(false);
      setMessages([]);
      setIsPartnerTyping(false);
    });

    socket.on("typing", () => setIsPartnerTyping(true));
    socket.on("stopTyping", () => setIsPartnerTyping(false));

    return () => {
      socket.off("paired");
      socket.off("waiting");
      socket.off("chatMessage");
      socket.off("partnerDisconnected");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  const handleStart = () => {
    if (!username.trim()) return alert("Enter your name");
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

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (e.target.value.trim()) {
      socket.emit("typing");
    } else {
      socket.emit("stopTyping");
    }
  };

  const handleSkip = () => {
    socket.emit("skip");
    setPaired(false);
    setMessages([]);
    setIsPartnerTyping(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-black to-blue-900 text-white">
      {/* Header */}
      <div className="p-3 bg-gray-900 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-red-700 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
        >
          ⬅ Back
        </button>
        {paired && (
          <h2 className="text-lg italic font-bold text-center flex-1">
            Chatting with: {partnerName}
          </h2>
        )}
      </div>

      {/* BEFORE PAIRING UI */}
      {!connected ? (
        <motion.div
          className="flex flex-col items-center justify-center flex-1 p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-xl font-bold mb-4 text-center">🎓 Peer Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 mb-3 bg-gray-700 rounded text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="flex items-center mb-4 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mr-2"
            />
            I agree to the community guidelines.
          </label>
          <button
            onClick={handleStart}
            className={`w-full py-3 rounded text-pink-900 ${
              agree
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!agree}
          >
            Start Chatting
          </button>
        </motion.div>
      ) : !paired ? (
        <div className="flex flex-1 flex-col justify-center items-center">
          <div className="w-10 h-10 mb-4 border-4 border-t-white border-gray-400 rounded-full animate-spin"></div>
          <p className="text-lg">Searching for a peer...</p>
        </div>
      ) : (
        <>
          {/* Chat message list (scrollable) */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                    msg.sender === "You" ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-[10px] text-gray-300 mt-1 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isPartnerTyping && (
              <p className="text-xs text-gray-400 italic ml-2">Typing...</p>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Input section fixed at bottom */}
          <div className="p-2 flex gap-2 items-center w-full">
  <input
    className="flex-1 px-3 py-2 rounded bg-gray-700 text-sm outline-none"
    placeholder="Type a message..."
    value={input}
    onChange={handleTyping}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  />

  <AnimatePresence mode="wait">
    {input.trim() ? (
      <motion.button
        key="send"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={sendMessage}
        className="bg-white text-pink-900 px-3 py-2 rounded whitespace-nowrap"
      >
        Send
      </motion.button>
    ) : (
      <motion.button
        key="skip"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={handleSkip}
        className="bg-red-600 text-pink-900 px-3 py-2 rounded whitespace-nowrap"
      >
        Skip
      </motion.button>
    )}
  </AnimatePresence>
</div>

        </>
      )}
    </div>
  );
}
