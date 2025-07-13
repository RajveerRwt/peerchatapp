import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Login failed: " + error.message);
    } else {
      setMessage("✅ Logged in successfully!");
      onLogin(); // Tell App to go to admin panel
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow rounded mt-10">
      <h2 className="text-lg font-semibold mb-4 text-center">🔐 Admin Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          className="border p-2 rounded"
          placeholder="admin@peerchat.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 rounded"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-pink-700 text-pink-700 px-4 py-2 rounded hover:bg-pink-800"
        >
          Login
        </button>
      </form>
      <p className="text-red-600 mt-2 text-center">{message}</p>
    </div>
  );
}
