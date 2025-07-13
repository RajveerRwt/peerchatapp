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

    setLiked(data.length > 0);
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
    } else {
      await supabase.from("likes").insert([{ confession_id: confessionId, user_ip: userId }]);
    }

    setLiked(!liked);
    fetchCount();
  };

  return (
    <button
      onClick={toggleLike}
      className="flex items-center space-x-1 text-pink-600 text-sm mt-1"
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{count} {count === 1 ? "Like" : "Likes"}</span>
    </button>
  );
}
