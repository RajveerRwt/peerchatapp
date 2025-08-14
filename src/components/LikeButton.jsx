import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const getUserId = () => {
  let id = localStorage.getItem("peerchat_user");
  if (!id) {
    id = `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem("peerchat_user", id);
  }
  return id;
};

export default function LikeButton({ confessionId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [animating, setAnimating] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    checkLiked();
    fetchCount();
  }, []);

  const checkLiked = async () => {
    const { data } = await supabase
      .from("likes")
      .select("*")
      .eq("confession_id", confessionId)
      .eq("user_ip", userId);

    setLiked(data?.length > 0);
  };

  const fetchCount = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("confession_id", confessionId);
    setCount(count || 0);
  };

  const toggleLike = async () => {
    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("confession_id", confessionId)
        .eq("user_ip", userId);
      setLiked(false);
      setCount((c) => c - 1);
    } else {
      await supabase
        .from("likes")
        .insert([{ confession_id: confessionId, user_ip: userId }]);
      setLiked(true);
      setCount((c) => c + 1);

      // Trigger heart pop animation
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 transition-all duration-200"
    >
      <span
        className={`text-lg transition-transform duration-300 ${
          animating ? "scale-125" : "scale-100"
        }`}
      >
        {liked ? "❤️" : "🤍"}
      </span>
      <span className="font-medium text-sm">{count} {count === 1 ? "Like" : "Likes"}</span>
    </button>
  );
}
