import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.href,
      },
    });

    if (error) {
      console.error("Login error:", error);
      alert("Failed to send login email.");
    } else {
      alert("Check your email to complete sign-in.");
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
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-screen-lg mx-auto">
        {/* Header */}
        <header
          className={`shadow p-3 flex items-center justify-between ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <img src="peerlogo.png" alt="PeerChat Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-green-500">PEERCHAT</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="px-3 py-1 rounded border"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Login / Signup
              </button>
            )}
          </div>
        </header>

        {/* Login Modal */}
        {showLogin && !user && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div
              className={`w-full max-w-sm bg-white p-6 rounded shadow relative ${
                darkMode ? "bg-gray-800 text-white" : ""
              }`}
            >
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              >
                ✖
              </button>
              <h2 className="text-lg font-bold mb-3">Login with Email</h2>
              <input
                type="email"
                placeholder="Enter your college email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded w-full mb-3 text-black"
              />
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Send Magic Link
              </button>
              <p className="text-sm text-gray-500 mt-2">
                A sign-in link will be sent to your email.
              </p>
            </div>
          </div>
        )}

        {/* Profile Setup */}
        {showProfileSetup && user && <ProfileSetup user={user} />}
      </div>

      {/* Home Page */}
      {activePage === "home" && !showLogin && (
        <div className="px-4 pt-4">
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setActiveFeed("confession")}
              className={`px-4 py-1 rounded-full ${
                activeFeed === "confession"
                  ? "bg-pink-600 text-green-900"
                  : "bg-white border"
              }`}
            >
              🗣 Confessions/memes
            </button>
            <button
              onClick={() => setActiveFeed("opportunity")}
              className={`px-4 py-1 rounded-full ${
                activeFeed === "opportunity"
                  ? "bg-indigo-600 text-green-900"
                  : "bg-white border"
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

      {/* Other Pages */}
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
