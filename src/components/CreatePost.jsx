// src/components/CreatePost.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const username = "Anonymous" + Math.floor(Math.random() * 1000);

    const { error } = await supabase.from("confessions").insert([
      {
        text,
        username,
      },
    ]);

    setLoading(false);
    if (error) {
      setMessage("Failed to post 😢");
    } else {
      setText("");
      setMessage("Posted successfully 🎉");
      onPostCreated?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 max-w-2xl mx-auto">
      <textarea
        placeholder="Write your confession or meme..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-2 rounded resize-none"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-black-600 hover:bg-pink-700 text-white py-1 px-4 rounded"
      >
        {loading ? "Posting..." : "Post Anonymously"}
      </button>
      <p className="text-sm text-green-600 mt-1">{message}</p>
    </form>
  );
}
