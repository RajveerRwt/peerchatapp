import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please choose a file");

    const fileName = `${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from("study-material")
      .upload(`materials/${branch}/${fileName}`, file);

    if (uploadError) {
      setMessage("Upload failed: " + uploadError.message);
      return;
    }

    const fileUrl = supabase.storage
      .from("study-material")
      .getPublicUrl(`materials/${branch}/${fileName}`).data.publicUrl;

    const { error: dbError } = await supabase.from("materials").insert([
      { title, description, type, branch, file_url: fileUrl },
    ]);

    if (dbError) {
      setMessage("Database error: " + dbError.message);
    } else {
      setMessage("Uploaded successfully!");
      setTitle("");
      setDescription("");
      setBranch("");
      setType("");
      setFile(null);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Admin Upload</h2>
      <form onSubmit={handleUpload}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="input" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className="input" />
        <input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Branch (e.g., CSE)" required className="input" />
        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (Notes/PYQ/etc)" required className="input" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required className="input" />
        <button type="submit" className="btn">Upload</button>
      </form>
      <p className="mt-2 text-sm text-green-600">{message}</p>
    </div>
  );
}
