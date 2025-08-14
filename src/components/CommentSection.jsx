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
      setError("Failed to post comment.");
      return;
    }

    setText("");
    fetchComments();
  };

  return (
    <div className="mt-3">
      {/* Toggle comment visibility */}
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all"
      >
        💬 <span>{comments.length} {comments.length !== 1 ? "Comments" : "Comment"}</span>
      </button>

      {/* Comment Drawer */}
      {visible && (
        <div className="mt-3 space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-inner">
          {/* Comment Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write something..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-pink-600 rounded-lg hover:bg-blue-600 transition"
            >
              Post
            </button>
          </form>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Comment List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-gray-700 p-2 rounded-lg text-sm shadow-sm"
              >
                <span className="font-semibold">@{comment.username || "Anon"}:</span>{" "}
                {comment.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
