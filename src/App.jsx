import React, { useState } from "react";
import ContactForm from "./pages/ContactForm";
import ChatApp from "./pages/ChatApp";

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = (section) => {
    setActiveSection((prev) => (prev === section ? "" : section));
    setShowMenu(false); // Close menu after selection on mobile
  };

  return (
    <div className="min-h-screen bg-yellow-500 text-gray p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl  font-bold">
          <img src="public/peerlogo.png" alt="logo" className="h-8 w-8"/> PeerChat</h1>
      
        <button
          aria-expanded={showMenu}
          aria-controls="main-menu"
          onClick={() => setShowMenu(!showMenu)}
          className="text-pink-800 bg-red-500   text-3xl px-2 py-2 rounded md:hidden"
        >
          ☰
        </button>
      </header>

      {/* Menu */}
      <nav
        id="main-menu"
        className={`md:flex flex-col md:flex-row gap-4 mb-6 ${showMenu ? "block" : "hidden"} md:block`}
      >
        <button
          onClick={() => handleToggle("about")}
          className="bg-grey hover:bg-blue-700 text-pink-800 px-4 py-2 rounded"
        >
          PeerChat ?
        </button>
        <button
          onClick={() => handleToggle("guidelines")}
          className="bg-green-600 hover:bg-green-700 text-pink-800 px-4 py-2 rounded"
        >
          Guidelines
        </button>
        <button
          onClick={() => handleToggle("security")}
          className="bg-purple-600 hover:bg-purple-700 text-pink-800 px-4 py-2 rounded"
        >
          Security & Anonymity
        </button>
        <button
          onClick={() => handleToggle("contact")}
          className="bg-yellow-600 hover:bg-yellow-700 text-pink-800 px-4 py-2 rounded"
        >
          💬 Send Feedback
        </button>
      </nav>

      {/* Section Rendering */}
      {activeSection === "about" && (
        <Section
          title="🧠 What is PeerChat?"
          content={[
            "PeerChat is an anonymous chat platform for students of different colleges and universities to connect freely, share knowledge, and find study partners or discuss ideas.",
          ]}
        />
      )}
      {activeSection === "guidelines" && (
        <Section
          title="📜 Community Guidelines"
          list={[
            "Be respectful to everyone — no hate speech or abuse.",
            "Do not share personal info (like phone numbers or emails).",
            "No spam, trolling, or illegal activity.",
            "Maintain decorum — you're among fellow students.",
            "Support each other through doubt-solving, sharing, and learning.",
          ]}
        />
      )}
      {activeSection === "security" && (
        <Section
          title="🔐 Security & Anonymity"
          content={[
            "Your chats are anonymous and end-to-end encrypted. We don’t store your messages. You’re randomly paired with fellow students. Your identity stays hidden unless you reveal it.",
          ]}
        />
      )}
      {activeSection === "contact" && (
        <ContactForm onClose={() => setActiveSection("")} />
      )}

      {/* Chat */}
      <ChatApp />
    </div>
  );
}

function Section({ title, content = [], list = [] }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4 transition-all duration-300 ease-in-out text-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {content.map((p, i) => (
        <p key={i} className="mb-2 text-sm text-gray-300">
          {p}
        </p>
      ))}
      {list.length > 0 && (
        <ul className="list-disc list-inside text-sm text-gray-300">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      
    </div>
  );
}
