import { useState } from "react";
import { supabase } from "../supabaseClient";

// Utility to create anonymous names
function generateAnonName() {
  const animals = ["Tiger", "Lion", "Fox", "Panda", "Wolf", "Rabbit", "Dolphin"];
  const adjectives = ["Silent", "Mysterious", "Brave", "Happy", "Angry", "Clever"];
  const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${Math.floor(Math.random() * 100)}`;
  return name;
}

export default function CreateConfession({ onPosted }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return setMessage("Please enter something");

    let imageUrl = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from("confession-images")
        .upload(`confessions/${fileName}`, image);

      if (error) return setMessage("Image upload error: " + error.message);

      imageUrl = supabase.storage
        .from("confession-images")
        .getPublicUrl(`confessions/${fileName}`).data.publicUrl;
    }

    const username = generateAnonName();

    const { error: dbError } = await supabase.from("confessions").insert([
      { text, image_url: imageUrl, username },
    ]);

    if (dbError) return setMessage("Database error: " + dbError.message);

    setText("");
    setImage(null);
    setMessage("✅ Posted successfully!");
    if (onPosted) onPosted();
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mb-6">
      <h2 className="text-lg font-bold mb-3 text-center">Post as Anonymous</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          placeholder="Write your confession or meme..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Post
        </button>
        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
