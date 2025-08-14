import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function UploadOpportunity() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // HTML output from Quill
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.email !== "rajveerrawat947@gmail.com") {
      return setMessage("❌ You are not authorized to upload opportunities.");
    }

    if (!title || !description) {
      return setMessage("❗ Title and Description are required.");
    }

    setLoading(true);
    let imageUrl = null;

    if (image) {
      const filename = `opp-${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("opportunity-images")
        .upload(`images/${filename}`, image);

      if (uploadError) {
        setLoading(false);
        return setMessage("Image upload failed: " + uploadError.message);
      }

      const { data } = supabase.storage
        .from("opportunity-images")
        .getPublicUrl(`images/${filename}`);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("opportunities").insert([
      {
        title,
        description, // HTML from React Quill
        file_url: link,
        image_url: imageUrl,
        posted_by: user.email,
      },
    ]);

    setLoading(false);
    if (error) {
      setMessage("❌ Upload failed: " + error.message);
    } else {
      setMessage("✅ Opportunity posted successfully!");
      setTitle("");
      setDescription("");
      setLink("");
      setImage(null);
    }
  };

  if (!user) {
    return <p className="p-4 text-center">⏳ Checking admin access...</p>;
  }

  if (user.email !== "rajveerrawat947@gmail.com") {
    return <p className="p-4 text-center text-red-600">🚫 Not authorized</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white shadow-lg rounded-xl p-5">
      <h2 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
        📤 Upload Opportunity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />

        {/* Rich Text Editor */}
        <ReactQuill
          value={description}
          onChange={setDescription}
          theme="snow"
          placeholder="Write your description here with full formatting..."
          className="bg-white rounded-lg"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "blockquote", "code-block"],
              ["clean"],
            ],
          }}
        />

        <input
          type="url"
          placeholder="External Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transform transition-all"
        >
          {loading ? "Uploading..." : "Upload Opportunity"}
        </button>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
