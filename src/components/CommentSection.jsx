import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const getUsername = () => {
  return localStorage.getItem("peerchat_user") || "Anon";
};

export default function CommentSection({ confessionId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("confession_id", confessionId)
      .order("created_at", { ascending: true });

    if (data) setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await supabase.from("comments").insert([
      {
        confession_id: confessionId,
        text,
        username: getUsername(),
      },
    ]);

    setText("");
    fetchComments();
  };

  return (
    <div className="mt-4 space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border px-3 py-1 rounded text-sm"
        />
        <button type="submit" className="text-sm px-3 py-1 bg-pink-600 text-white rounded">
          Post
        </button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id} className="text-sm text-gray-700 border-l-4 pl-2 border-pink-200">
          <span className="font-semibold">@{comment.username || "Anon"}:</span> {comment.text}
        </div>
      ))}
    </div>
  );
}
