// src/components/CreatePost.jsx
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
      const { data, error: uploadError } = await supabase.storage
        .from("confession-images") // make sure this bucket exists
        .upload(`confessions/${fileName}`, image);

      if (uploadError) {
        setMessage("Image upload failed");
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
      setMessage("Failed to post 😢");
    } else {
      setText("");
      setImage(null);
      setMessage("Posted successfully 🎉");
      onPostCreated?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-pink-200 p-4 rounded shadow mb-4 max-w-2xl mx-auto">
      <textarea
        placeholder="Write your confession or meme..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-2 rounded resize-none"
        rows={3}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mt-2 block text-sm text-gray-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-black-600 hover:bg-black-700 text-pink-700 py-1 px-4 rounded"
      >
        {loading ? "Posting..." : "Post Anonymously"}
      </button>

      <p className="text-sm text-green-600 mt-2">{message}</p>
    </form>
  );
}
