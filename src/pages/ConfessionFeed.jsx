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
      <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm mb-6">
        🎭 Campus Buzz
      </h2>

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">
          Loading the latest vibes...
        </p>
      ) : confessions.length === 0 ? (
        <p className="text-center text-gray-400">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        confessions.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {post.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  @{post.username || "Anonymous"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
              <p className="text-gray-800 dark:text-gray-200 text-base whitespace-pre-wrap leading-relaxed">
                {post.text}
              </p>

              {post.image_url && (
                <div className="mt-3">
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full rounded-xl object-cover max-h-[400px] shadow-sm hover:scale-[1.01] transition-transform duration-200"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex flex-col gap-3 border-t pt-3 border-gray-100 dark:border-gray-800">
                <LikeButton confessionId={post.id} />
                <CommentSection confessionId={post.id} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
