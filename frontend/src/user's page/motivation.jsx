import { useEffect, useState } from "react";
import { FaSmile, FaRocket, FaHeart } from "react-icons/fa";
import { motivations } from "../components/helpers";

export default function Motivation() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = motivations[Math.floor(Math.random() * motivations.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-100 to-blue-100 p-6">
      <div className="text-center space-y-6 max-w-lg">
        <div className="flex justify-center">
          <FaSmile className="text-yellow-500 text-6xl animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-teal-700">
          Hayotingni o'zgartir!
        </h1>

        <p className="text-xl text-gray-700 italic animate-pulse">
          "{quote}"
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <FaRocket className="text-purple-500 text-4xl animate-spin-slow" />
          <FaHeart className="text-pink-400 text-4xl animate-bounce" />
        </div>

        <p className="text-sm text-gray-400 mt-4">Sen eng yaxshilardan birisan! 🌟</p>
      </div>
    </div>
  );
}
