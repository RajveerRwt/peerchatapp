import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function UploadOpportunity() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.email !== "rajveerrawat947@gmail.com") {
      setMessage("❌ You are not authorized to upload opportunities.");
      return;
    }

    const { error } = await supabase.from("opportunities").insert([
      {
        title,
        description,
        link,
        posted_by: user.email,
      },
    ]);

    if (error) {
      setMessage("Upload failed: " + error.message);
    } else {
      setMessage("✅ Opportunity posted successfully!");
      setTitle("");
      setDescription("");
      setLink("");
    }
  };

  if (!user) {
    return <p className="p-4 text-center">⏳ Checking admin access...</p>;
  }

  if (user.email !== "rajveerrawat947@gmail.com") {
    return <p className="p-4 text-center text-red-600">🚫 Not authorized</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload Opportunity</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          className="p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="url"
          placeholder="Link (https://...)"
          className="p-2 border rounded"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Upload
        </button>
        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
