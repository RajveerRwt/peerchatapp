import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    let imageUrl = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("confession-images")
        .upload(`confessions/${fileName}`, image);

      if (uploadError) {
        setMessage("❌ Image upload failed");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("confession-images")
        .getPublicUrl(`confessions/${fileName}`);

      imageUrl = urlData.publicUrl;
    }

    const username = "Anonymous" + Math.floor(Math.random() * 1000);

    const { error } = await supabase.from("confessions").insert([
      {
        text,
        username,
        image_url: imageUrl,
      },
    ]);

    setLoading(false);
    if (error) {
      setMessage("❌ Failed to post");
    } else {
      setText("");
      setImage(null);
      setMessage("✅ Posted successfully!");
      onPostCreated?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 rounded-2xl shadow-xl mb-6 max-w-2xl mx-auto border border-white/40 backdrop-blur-lg"
    >
      <textarea
        placeholder="✨ Post confessions/thoughts or memes..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-white/70 border border-gray-300 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-500"
        rows={4}
        required
      />

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-pink-600 transition-colors">
          📷 <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post 🔥"}
        </button>
      </div>

      {message && (
        <p className={`text-sm mt-3 ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
