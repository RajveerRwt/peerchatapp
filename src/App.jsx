import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import ChatApp from "./ChatApp";
import HomePage from "./HomePage";
import StaticPage from "./StaticPage";
import ContactForm from "./ContactForm";
import AdminUpload from "./pages/AdminUpload";
import UploadOpportunity from "./pages/UploadOpportunity";
import MaterialsList from "./pages/MaterialsList";
import ConfessionFeed from "./pages/ConfessionFeed";
import OpportunityFeed from "./pages/OpportunityFeed";
import AdminLogin from "./pages/AdminLogin";
import CreatePost from "./components/CreatePost";
import Navbar from "./components/Navbar";
import ProfileSetup from "./components/ProfileSetup";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [activeFeed, setActiveFeed] = useState("confession");
  const [refreshFeed, setRefreshFeed] = useState(0);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const staticPages = {
    what: {
      title: "🚀 What is PeerChat?",
      content:
        "PeerChat is a student-friendly platform to connect, post anonymously, and access opportunities and study material.",
    },
    guidelines: {
      title: "📜 Guidelines",
      content: "Be respectful. No hate, spam, or personal attacks.",
    },
    privacy: {
      title: "🔒 Privacy Policy",
      content: "We don’t store your personal data or chat history.",
    },
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) setUser(session.user);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href },
    });

    if (error) {
      alert("❌ Failed to send login email.");
    } else {
      alert("✅ Check your email to complete sign-in.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowProfileSetup(false);
  };

  return (
    <div
      className={`min-h-screen font-sans pb-24 transition-colors duration-300 ${
        darkMode ? "bg-[#0e0e10] text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-screen-lg mx-auto">
        {/* HEADER */}
        <header
          className={`p-4 flex items-center justify-between rounded-b-2xl shadow-lg backdrop-blur-md ${
            darkMode
              ? "bg-gradient-to-r from-[#1a1a1d] to-[#0e0e10]"
              : "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 text-white"
          }`}
        >
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <img
              src="peerlogo.png"
              alt="PeerChat Logo"
              className="w-11 h-11 rounded-full border-2 border-white shadow-lg"
            />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-md">
              Peer<span className="text-yellow-300">Chat</span>
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="relative inline-flex items-center h-7 rounded-full w-14 bg-pink-900 dark:bg-red-700 transition-colors duration-300 border border-yellow/20 shadow-md"
            >
              <span
                className={`transform transition-transform duration-300 inline-block w-5 h-5 bg-yellow-500 rounded-full shadow-md ${
                  darkMode ? "translate-x-7 bg-red-500" : "translate-x-1"
                }`}
              />
            </button>

            {/* Login/Logout */}
            
            
          </div>
        </header>

        {/* LOGIN MODAL */}
        {showLogin && !user && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
            <div
              className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl relative backdrop-blur-lg ${
                darkMode ? "bg-[#1a1a1d]/90 text-white" : "bg-white/90"
              }`}
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-3 right-4 text-2xl hover:text-red-500"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold mb-4">📩 Login with Email</h2>
              <input
                type="email"
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 rounded-lg w-full mb-4 text-black focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                onClick={handleLogin}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all"
              >
                Send Magic Link
              </button>
              <p className="text-sm mt-3 opacity-80">
                A sign-in link will be sent to your email.
              </p>
            </div>
          </div>
        )}

        {/* Profile Setup */}
        {showProfileSetup && user && <ProfileSetup user={user} />}
      </div>

      {/* HOME PAGE */}
      {activePage === "home" && !showLogin && (
        <div className="px-4 pt-4">
          {/* Feed Tabs */}
          <div className="flex justify-center gap-3 mb-5 flex-wrap">
            {["confession", "opportunity"].map((feed) => (
              <button
                key={feed}
                onClick={() => setActiveFeed(feed)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  activeFeed === feed
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {feed === "confession" ? "🗣 Confessions/Memes" : "🎯 Opportunities"}
              </button>
            ))}
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

      {/* OTHER PAGES */}
      {activePage === "chat" && <ChatApp />}
      {activePage === "feedback" && <ContactForm />}
      {activePage === "materials" && <MaterialsList />}
      {activePage === "admin" && <AdminUpload />}
      {activePage === "upload-opportunity" && <UploadOpportunity />}
      {activePage === "admin-login" && (
        <AdminLogin onLogin={() => setActivePage("admin")} />
      )}
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
