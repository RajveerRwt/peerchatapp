export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 PeerChat</h1>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-900 bg-gray-200 px-3 py-1 rounded md:hidden"
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
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          What is PeerChat?
        </button>
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Guidelines
        </button>
        <button
          onClick={() => setShowSecurity(!showSecurity)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Security & Anonymity
        </button>
        <button
          onClick={() => setShowContactForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded"
        >
          💬 Send Feedback
        </button>
      </nav>

      {/* Sections */}
      {showAbout && (
        <Section
          title="🧠 What is PeerChat?"
          content={[
            "PeerChat is an anonymous chat platform for students of different colleges and universities to connect freely, share knowledge, and find study partners or discuss ideas.",
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
