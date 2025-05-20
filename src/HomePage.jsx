// src/HomePage.jsx
import React from "react";

export default function HomePage({ onStartChat, onSelectPage }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to PeerChat</h1>

      <div className="grid grid-cols-1 gap-4 mb-6 w-full max-w-xs">
        <button
          className="bg-blue-600 text-yellow-800 py-2 rounded"
          onClick={() => onSelectPage("what")}
        >
          What is PeerChat?
        </button>
        <button
          className="bg-blue-600 text-yellow-800 py-2 rounded"
          onClick={() => onSelectPage("guidelines")}
        >
          Guidelines
        </button>
        <button
          className="bg-blue-600 text-yellow-800 py-2 rounded"
          onClick={() => onSelectPage("feedback")}
        >
          Send Feedback
        </button>
        <button
          className="bg-blue-600 text-yellow-800  py-2 rounded"
          onClick={() => onSelectPage("privacy")}
        >
          Privacy Policy
        </button>
      </div>

      <button
        className="bg-green-600 text-red-800  py-3 px-6 text-lg rounded-full shadow"
        onClick={onStartChat}
      >
        Start Chat
      </button>
    </div>
  );
}
