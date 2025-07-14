import { useState } from "react";
import ChatApp from "./ChatApp";
import HomePage from "./HomePage";
import StaticPage from "./StaticPage";
import ContactForm from "./ContactForm";

// Pages
import AdminUpload from "./pages/AdminUpload";
import UploadOpportunity from "./pages/UploadOpportunity";
import MaterialsList from "./pages/MaterialsList";
import ConfessionFeed from "./pages/ConfessionFeed";
import OpportunityFeed from "./pages/OpportunityFeed";
import AdminLogin from "./pages/AdminLogin";

// Components
import CreatePost from "./components/CreatePost";
import Navbar from "./components/Navbar";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [activeFeed, setActiveFeed] = useState("confession");
  const [refreshFeed, setRefreshFeed] = useState(0);

  const staticPages = {
    what: {
      title: "What is PeerChat?",
      content:
        "PeerChat is a student-friendly platform to connect, post anonymously, and access opportunities and study material.",
    },
    guidelines: {
      title: "Guidelines",
      content: "Be respectful. No hate, spam, or personal attacks.",
    },
    privacy: {
      title: "Privacy Policy",
      content: "We don’t store your personal data or chat history.",
    },
  };

  return (
    
    <div className="min-h-screen bg-gray-100 pb-24 font-sans">
      <div className="max-w-screen-lg mx-auto">
  {/* Header code here */
  <header className="bg-white shadow p-3 flex items-center gap-2">
  <img src="STULOGO.jpeg" alt="PeerChat Logo" className="w-8 h-8" />
  <h1 className="text-xl font-bold text-BLUE-600">PEERCHAT</h1>
</header>
}
</div>
      {/* Home with toggle for Confession & Opportunity Feed */}
      {activePage === "home" && (
        <div className="px-4 pt-4">
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setActiveFeed("confession")}
              className={`px-4 py-1 rounded-full ${
                activeFeed === "confession" ? "bg-pink-600 text-blue-700" : "bg-white border"
              }`}
            >
              🗣 Confessions/memes
            </button>
            <button
              onClick={() => setActiveFeed("opportunity")}
              className={`px-4 py-1 rounded-full ${
                activeFeed === "opportunity" ? "bg-indigo-600 text-yellow-700" : "bg-white border"
              }`}
            >
              🎯 Opportunities
            </button>
          </div>

          {activeFeed === "confession" && (
            <>
              <CreatePost onPostCreated={() => setRefreshFeed((r) => r + 1)} />
              <ConfessionFeed key={refreshFeed} />
            </>
          )}

          {activeFeed === "opportunity" && <OpportunityFeed />}
        </div>
      )}

      {activePage === "chat" && <ChatApp />}
      {activePage === "feedback" && <ContactForm />}
      {activePage === "materials" && <MaterialsList />}
      {activePage === "admin" && <AdminUpload />}
      {activePage === "upload-opportunity" && <UploadOpportunity />}
      {activePage === "admin-login" && <AdminLogin onLogin={() => setActivePage("admin")} />}

      {["what", "guidelines", "privacy"].includes(activePage) && (
        <StaticPage
          title={staticPages[activePage].title}
          content={staticPages[activePage].content}
          onBack={() => setActivePage("home")}
        />
      )}

      {/* Bottom Navbar */}
      <Navbar setActivePage={setActivePage} />
    </div>
  );
}
