import React, { useState } from "react";
import ContactForm from "./pages/ContactForm";
import ChatApp from "./pages/ChatApp";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  return (
    <div className="min-h-screen bg-white text-grey-900 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 PeerChat</h1>

        
       
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-white bg-gery text-3xl md:hidden"
        >
          ☰
        </button>
      </header>

      {/* Hamburger Menu Options */}
      <nav
        className={`md:flex flex-col md:flex-row gap-4 mb-6 ${
          showMenu ? "block" : "hidden"
        } md:block`}
      >
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          What is PeerChat?
        </button>
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Guidelines
        </button>
        <button
          onClick={() => setShowSecurity(!showSecurity)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Security & Anonymity
        </button>
        <button
          onClick={() => setShowContactForm(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          💬 Send Feedback
        </button>
      </nav>

      {/* Sections */}
      {showAbout && (
        <Section
          title="🧠 What is PeerChat?"
          content={[
            "PeerChat is an anonymous chat platform for students of different  colleges and universities to connect freely, share knowledge, and find study partners or discuss ideas.",
          ]}
        />
      )}

      {showGuidelines && (
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

      {showSecurity && (
        <Section
          title="🔐 Security & Anonymity"
          content={[
            "Your chats are anonymous and end-to-end encrypted. We don’t store your messages. You’re randomly paired with fellow students. Your identity stays hidden unless you reveal it.",
          ]}
        />
      )}

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}

      {/* Chat Component */}
      <ChatApp />
      
    </div>
  );
}

// Helper section renderer
function Section({ title, content = [], list = [] }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
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
