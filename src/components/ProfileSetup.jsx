import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ProfileSetup({ user }) {
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async () => {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      gender,
      course,
      year: parseInt(year),
    });
    if (!error) alert("Profile created!");
    else console.error("Error saving profile", error);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Create Your Profile</h2>
      <select onChange={(e) => setGender(e.target.value)} className="border p-2 rounded mb-2 w-full">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input
        type="text"
        placeholder="Course (e.g. B.Tech CSE)"
        onChange={(e) => setCourse(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Year (e.g. 2)"
        onChange={(e) => setYear(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Profile
      </button>
    </div>
  );
}
