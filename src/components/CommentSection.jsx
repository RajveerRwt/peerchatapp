import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const getUsername = () => {
  let name = localStorage.getItem("peerchat_user");
  if (!name) {
    name = `User${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem("peerchat_user", name);
  }
  return name;
};

export default function CommentSection({ confessionId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (confessionId) fetchComments();
  }, [confessionId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("confession_id", confessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments.");
    } else {
      setComments(data || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const { error } = await supabase.from("comments").insert([
      {
        confession_id: confessionId,
        text,
        username: getUsername(),
      },
    ]);

    if (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to post comment.");
      return;
    }

    setText("");
    fetchComments();
  };

  return (
    <div className="mt-3 space-y-2">
      {/* Toggle comment visibility */}
      <button
        onClick={() => setVisible(!visible)}
        className="text-sm text-pink-600 hover:underline"
      >
        💬 {comments.length} Comment{comments.length !== 1 ? "s" : ""}
      </button>

      {/* Comment Box + Comments List */}
      {visible && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border px-3 py-1 rounded text-sm"
            />
            <button
              type="submit"
              className="text-sm px-3 py-1 bg-pink-600 text-white rounded"
            >
              Post
            </button>
          </form>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="text-sm text-gray-800 bg-gray-100 rounded p-2"
            >
              <span className="font-semibold">@{comment.username || "Anon"}:</span>{" "}
              {comment.text}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
