import React from "react";

export default function Navbar({ setActivePage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50">
      <div className="flex justify-around items-center h-16 text-xs text-gray-600">
        <button
          onClick={() => setActivePage("home")}
          className="flex flex-col items-center hover:text-pink-600"
        >
          🏠
          <span>Home</span>
        </button>

        <button
          onClick={() => setActivePage("chat")}
          className="flex flex-col items-center hover:text-pink-600"
        >
          💬
          <span>Chat</span>
        </button>

        <button
          onClick={() => setActivePage("materials")}
          className="flex flex-col items-center hover:text-pink-600"
        >
          📚
          <span>Study</span>
        </button>

        <button
          onClick={() => setActivePage("upload-opportunity")}
          className="flex flex-col items-center hover:text-pink-600"
        >
          ➕
          <span>Upload</span>
        </button>

        <button
          onClick={() => setActivePage("admin-login")}
          className="flex flex-col items-center hover:text-pink-600"
        >
          🛠️
          <span>Admin</span>
        </button>
      </div>
    </nav>
  );
}
