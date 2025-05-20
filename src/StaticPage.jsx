// src/StaticPage.jsx
import React from "react";

export default function StaticPage({ title, content, onBack }) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 text-red-700 bg-gray-700 px-3 py-1 rounded"
      >
        ⬅ Back
      </button>
      <h2 className="text-2xl font-bold italic mb-4 text-center">{title}</h2>
      <p className="text-center text-sm leading-relaxed max-w-md">{content}</p>
    </div>
  );
}
