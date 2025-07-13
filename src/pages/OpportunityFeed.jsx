// src/pages/OpportunityFeed.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function OpportunityFeed() {
  const [opportunities, setOpportunities] = useState([]);

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
    <div className="max-w-screen-sm mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">🎯 Opportunities</h2>
      {opportunities.length === 0 && (
        <p className="text-gray-600 text-center">No opportunities yet.</p>
      )}
      <div className="flex flex-col gap-4">
        {opportunities.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold text-indigo-700">
              {item.title}
            </h3>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <a
              href={item.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 underline"
            >
              📄 View File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
