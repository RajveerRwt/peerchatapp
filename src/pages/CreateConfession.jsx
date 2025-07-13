import { useState } from "react";
import { supabase } from "../supabaseClient";

function generateAnonName() {
  const animals = ["Tiger", "Lion", "Fox", "Panda", "Wolf", "Rabbit", "Dolphin"];
  const adjectives = ["Silent", "Mysterious", "Brave", "Happy", "Angry", "Clever"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${Math.floor(Math.random() * 100)}`;
}

export default function CreateConfession({ onPosted }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!text.trim()) {
      setMessage("⚠️ Please write something!");
      setLoading(false);
      return;
    }

    let imageUrl = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from("confession-images")
        .upload(`confessions/${fileName}`, image);

      if (error) {
        setMessage("❌ Image upload failed: " + error.message);
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage
        .from("confession-images")
        .getPublicUrl(`confessions/${fileName}`).data.publicUrl;
    }

    const username = generateAnonName();

    const { error: insertError } = await supabase.from("confessions").insert([
      { text, image_url: imageUrl, username },
    ]);

    if (insertError) {
      setMessage("❌ Failed to post: " + insertError.message);
    } else {
      setText("");
      setImage(null);
      setPreviewUrl(null);
      setMessage("✅ Posted successfully!");
      if (onPosted) onPosted();
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center text-pink-600">Post Anonymously</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border border-gray-300 rounded p-3 resize-none focus:outline-pink-500"
          rows="4"
          placeholder="Write your confession or meme..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        {/* Image Upload */}
        <div>
          <label
            htmlFor="imageUpload"
            className="inline-block cursor-pointer px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200"
          >
            📸 Choose Image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {image && (
            <p className="text-sm mt-1 text-gray-600">Selected: {image.name}</p>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 max-h-60 object-contain mx-auto rounded"
          />
        )}

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>

        {message && (
          <p className="text-sm text-center mt-2 text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}
