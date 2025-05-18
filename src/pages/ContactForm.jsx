import React from "react";
import { useForm, ValidationError } from "@formspree/react";

export default function ContactForm({ onClose }) {
  const [state, handleSubmit] = useForm("xeogzevy"); // your Formspree ID

  if (state.succeeded) {
    return (
      <div className="text-center bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
        <p className="text-green-700 dark:text-green-300 text-lg font-semibold">
          ✅ Thanks for your feedback!
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-800 text-black px-4 py-2 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mt-10"
    >
      <h2 className="text-2xl text-white font-bold mb-4 text-center">
        💬 Feedback / Suggestions
      </h2>

      <label htmlFor="message" className="block text-white mb-1">
        Your Message
      </label>
      <textarea
        id="message"
        name="message"
        required
        placeholder="Write your feedback or suggestions here..."
        className="w-full p-3 mb-4 rounded bg-gray-700 text-white h-32 resize-none placeholder-gray-400"
      />
      <ValidationError prefix="Message" field="message" errors={state.errors} />

      <div className="flex justify-between">
        <button
          type="submit"
          disabled={state.submitting}
          className="bg-blue-600 hover:bg-blue-700 text-black py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-black py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </form>
  );
}
