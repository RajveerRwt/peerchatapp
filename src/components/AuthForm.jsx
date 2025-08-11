import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSubmitted(true);
    else alert("Error sending OTP");
  };

  return (
    <div className="p-4">
      <input
        type="email"
        placeholder="Enter college email"
        className="border px-3 py-2 rounded w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Send OTP
      </button>
      {submitted && <p>📩 OTP sent! Check your inbox.</p>}
    </div>
  );
}
