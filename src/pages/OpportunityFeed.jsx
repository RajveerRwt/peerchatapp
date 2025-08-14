import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function OpportunityFeed() {
  const [opportunities, setOpportunities] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setOpportunities(data);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        🚀 Latest Opportunities
      </h2>

      {opportunities.length === 0 ? (
        <p className="text-gray-500 text-center italic">No opportunities yet. Stay tuned!</p>
      ) : (
        <div className="flex flex-col gap-6">
          {opportunities.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full h-52 object-cover" />
              )}

              <div className="p-5">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">{item.title}</h3>

                <div
                  className="text-gray-600 text-sm mt-2 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />

                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setSelected(item)}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    🌟 Explore Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 relative pb-[70px]">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✖
            </button>

            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.title}
                className="w-full h-48 object-cover rounded-xl"
              />
            )}

            <h3 className="text-2xl font-bold text-gray-800 mt-4">{selected.title}</h3>
            <div
              className="text-gray-600 mt-3 space-y-3"
              dangerouslySetInnerHTML={{ __html: selected.description }}
            />

            {selected.file_url && (
              <a
                href={selected.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-5 text-center px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-105 transition-transform"
              >
                🔗 Visit Link
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
