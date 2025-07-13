import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import LikeButton from "../components/LikeButton";
import CommentSection from "../components/CommentSection";

export default function ConfessionFeed() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching confessions:", error.message);
    } else {
      setConfessions(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center text-pink-700 mb-4">
        🎭 Anonymous Confessions
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading confessions...</p>
      ) : confessions.length === 0 ? (
        <p className="text-center text-gray-400">No confessions yet.</p>
      ) : (
        confessions.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            {/* User Info */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                🧑
              </div>
              <div className="text-sm font-medium text-gray-800">
                @{post.username || "Anonymous"}
              </div>
              <div className="text-xs text-gray-400 ml-auto">
                {new Date(post.created_at).toLocaleString()}
              </div>
            </div>

            {/* Text */}
            <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>

            {/* Optional image */}
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Attachment"
                className="w-full mt-3 rounded-md object-cover max-h-96"
              />
            )}

            {/* Like and Comment Section */}
            <div className="mt-3 flex flex-col gap-2">
              <LikeButton confessionId={post.id} />
              <CommentSection confessionId={post.id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
