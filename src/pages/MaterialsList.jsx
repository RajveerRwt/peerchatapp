import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function MaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching materials:", error.message);
    } else {
      setMaterials(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📚 Study Materials</h1>
      {loading ? (
        <p>Loading...</p>
      ) : materials.length === 0 ? (
        <p>No materials found.</p>
      ) : (
        <div className="space-y-4">
          {materials.map((item) => (
            <div key={item.id} className="bg-white shadow p-4 rounded border">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600 mb-1">{item.description}</p>
              <p className="text-xs text-gray-500">
                Branch: <b>{item.branch}</b> | Type: <b>{item.type}</b>
              </p>
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 underline"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
