import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function OpportunityFeed() {
  const [opportunities, setOpportunities] = useState([]);
  const [expanded, setExpanded] = useState({}); // to toggle read more

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

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">🎯 Latest Opportunities</h2>

      {opportunities.length === 0 ? (
        <p className="text-gray-500 text-center">No opportunities yet. Stay tuned!</p>
      ) : (
        <div className="flex flex-col gap-6">
          {opportunities.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-indigo-700">{item.title}</h3>

                <p className="text-gray-700 text-sm">
                  {expanded[item.id] || item.description.length <= 150
                    ? item.description
                    : `${item.description.slice(0, 150)}...`}
                  {item.description.length > 150 && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="text-blue-500 text-xs ml-2"
                    >
                      {expanded[item.id] ? "Read Less" : "Read More"}
                    </button>
                  )}
                </p>

                {item.link && (
                  <div className="text-right mt-4">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded shadow"
                    >
                      🔗 Visit Link
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
