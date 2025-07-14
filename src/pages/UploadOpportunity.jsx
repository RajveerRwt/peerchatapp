import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function UploadOpportunity() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
        description,
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
    <div className="max-w-lg mx-auto mt-8 bg-pink-200 shadow rounded p-5">
      <h2 className="text-xl font-bold text-center mb-4 text-indigo-800">📤 Upload Opportunity</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />
        <input
          type="url"
          placeholder="External Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-pink-700 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Uploading..." : "Upload Opportunity"}
        </button>

        {message && <p className="text-center text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
