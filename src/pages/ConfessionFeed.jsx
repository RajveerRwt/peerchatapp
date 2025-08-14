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
    <div className="p-4 max-w-2xl mx-auto space-y-8">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg mb-8">
        🎭 Campus Buzz
      </h2>

      {/* Loading / Empty States */}
      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">
          Loading the latest vibes...
        </p>
      ) : confessions.length === 0 ? (
        <p className="text-center text-gray-400">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        confessions.map((post, i) => (
          <div
            key={post.id}
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/30 dark:border-gray-800 overflow-hidden animate-fadeIn"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/20 dark:border-gray-800">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
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

            {/* Text */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-gray-800 dark:text-gray-200 text-base whitespace-pre-wrap leading-relaxed">
                {post.text}
              </p>

              {/* Image */}
              {post.image_url && (
                <div className="mt-4 overflow-hidden rounded-xl">
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full object-cover max-h-[420px] transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 flex flex-col gap-3 border-t border-white/20 dark:border-gray-800">
              <LikeButton confessionId={post.id} />
              <CommentSection confessionId={post.id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* Add this to your Tailwind config or globals.css for animation */
