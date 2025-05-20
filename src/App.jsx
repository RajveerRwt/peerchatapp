// src/App.jsx
import { useState } from "react";
import ChatApp from "./ChatApp";
import HomePage from "./HomePage";
import StaticPage from "./StaticPage";
import ContactForm from "./ContactForm";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const goHome = () => setActivePage("home");

  const staticPages = {
    what: {
      title: "What is PeerChat?",
      content: "PeerChat is a student-friendly chat platform that helps college/university students connect with each other anonymously. It's designed for finding study partners, sharing knowledge, and having meaningful conversations — all in a safe and respectful environment.."
    },
    guidelines: {
      title: "Guidelines",
      content: "Be respectful, don’t spam, and never share personal info."
    },
    privacy: {
      title: "Privacy Policy",
      content: "We respect your privacy. Chats are not stored or monitored."
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden">
      {activePage === "home" && (
        <HomePage
          onStartChat={() => setActivePage("chat")}
          onSelectPage={setActivePage}
        />
      )}

      {activePage === "chat" && <ChatApp onBack={goHome} />}

      {activePage === "feedback" && <ContactForm onClose={goHome} />}

      {["what", "guidelines", "privacy"].includes(activePage) && (
        <StaticPage
          title={staticPages[activePage].title}
          content={staticPages[activePage].content}
          onBack={goHome}
        />
      )}
    </div>
  );
}
