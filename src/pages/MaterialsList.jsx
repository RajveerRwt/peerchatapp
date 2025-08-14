import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const branches = ["CS","IT", "CIVIL", "MECHANICAL", "ELECTRICAL", "ECE"];
const semesters = Array.from({ length: 8 }, (_, i) => i + 1);
const materialTypes = ["PYQ", "Notes", "Books"];

export default function MaterialsList() {
  const [branch, setBranch] = useState(localStorage.getItem("selectedBranch") || "");
  const [semester, setSemester] = useState("");
  const [type, setType] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMaterials = async () => {
    setLoading(true);

    let query = supabase.from("study_material").select("*").order("uploaded_at", { ascending: false });

    if (branch) query = query.eq("branch", branch);
    if (semester) query = query.eq("semester", semester);
    if (type) query = query.eq("material_type", type);

    const { data, error } = await query;

    if (!error) {
      setMaterials(data || []);
    } else {
      console.error("Error fetching:", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (branch) localStorage.setItem("selectedBranch", branch);
    fetchMaterials();
  }, [branch, semester, type]);

  const filteredMaterials = materials.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-gradient-to-br from-indigo-50 via-pink-50 to-purple-50 dark:from-[#0e0e10] dark:via-[#141418] dark:to-[#1a1a1d]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          Explore Study Materials
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 rounded-xl shadow-md text-pink-700">
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-pink-400 bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-pink-400 bg-white dark:bg-gray-700 dark:text-white text-pink-700"
          >
            <option value="">All Semesters</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {materialTypes.map((t) => (
              <button
                key={t}
                onClick={() => setType(type === t ? "" : t)}
                className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                  type === t
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-500 shadow-lg"
                    : "bg-white dark:bg-gray-700 dark:text-white hover:bg-pink-50 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="🔍 Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border flex-1 min-w-[200px] focus:ring-2 focus:ring-pink-400 bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Materials */}
        {loading ? (
          <p className="text-center text-lg animate-pulse">Loading materials...</p>
        ) : filteredMaterials.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No materials found 😔</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-5 hover:shadow-2xl transition group border border-pink-100 dark:border-gray-700"
              >
                {/* Subject Tag */}
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white mb-3 shadow-sm">
                  {item.subject}
                </span>

                {/* Title */}
                <h2 className="text-lg font-semibold mb-2 group-hover:text-pink-500 dark:group-hover:text-yellow-800 text-pink-700">
                  {item.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{item.description}</p>

                {/* Meta Info */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  📍 {item.branch} | 🎓 Sem {item.semester} | 📂 {item.material_type}
                </p>

                {/* Download */}
                <a
                  href={`${supabase.storage
                    .from("study-material")
                    .getPublicUrl(item.file_path).data.publicUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block w-full text-center bg-gradient-to-r from-white-900 to-white-500 text-white px-4 py-2 rounded-lg hover:from-pink-200 hover:to-pink-600 transition font-medium shadow-md"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
