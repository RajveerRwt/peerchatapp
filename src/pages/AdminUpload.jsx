import { useState } from "react";
import { supabase } from "../supabaseClient"; // your supabase client

export default function AdminUpload() {
  const [formData, setFormData] = useState({
    branch: "",
    semester: "",
    subject: "",
    material_type: "",
    title: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const branches = ["CS", "IT", "CIVIL", "MECHANICAL", "ELECTRICAL", "ECE"];
  const materialTypes = ["PYQ", "Notes", "Books"];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${fileName}`;

      // Upload file to bucket
      const { error: uploadError } = await supabase.storage
        .from("study-material")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert into database
      const { error: dbError } = await supabase.from("study_material").insert([
        {
          branch: formData.branch,
          semester: parseInt(formData.semester),
          subject: formData.subject,
          material_type: formData.material_type,
          title: formData.title,
          description: formData.description || null,
          file_path: filePath,
          uploaded_by: "Admin", // replace with actual admin name if needed
        },
      ]);

      if (dbError) throw dbError;

      alert("Material uploaded successfully 🚀");
      setFormData({
        branch: "",
        semester: "",
        subject: "",
        material_type: "",
        title: "",
        description: "",
      });
      setFile(null);
    } catch (err) {
      console.error("Error uploading material:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          📚 Upload Study Material
        </h2>

        {/* Branch */}
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Semester */}
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Semester</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>

        {/* Subject */}
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* Material Type */}
        <select
          name="material_type"
          value={formData.material_type}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Material Type</option>
          {materialTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Material Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "🚀 Upload"}
        </button>
      </div>
    </div>
  );
}
