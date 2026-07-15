import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRegCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function GetOnePublicTest() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const navigate = useNavigate();

  // Shuffle helper
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Load & shuffle questions on mount
  const loadQuestions = () => {
    const data = JSON.parse(localStorage.getItem("publicTest")) || [];
    if (!data.length) {
      navigate("/public-tests");
      return;
    }
    const shuffled = data.map((q) => ({
      ...q,
      answers: shuffleArray(q.answers),
    }));
    setQuestions(shuffled);
    setRandomQuestion(shuffled);
  };

  const setRandomQuestion = (data = questions) => {
    const randIndex = Math.floor(Math.random() * data.length);
    const randomQ = {
      ...data[randIndex],
      answers: shuffleArray(data[randIndex].answers),
    };
    setCurrentQuestion(randomQ);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(30);
      goToNextQuestion();
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (answerId) => {
    setSelected(answerId);
    setAnswered(true);

    const correctAnswer = currentQuestion?.answers?.find((a) => a.ok === true);
    if (correctAnswer && correctAnswer._id === answerId) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      goToNextQuestion();
      setTimeLeft(30);
    }, 1000);
  };

  const goToNextQuestion = () => {
    setSelected(null);
    setAnswered(false);
    setTotalAnswered((prev) => prev + 1);
    setRandomQuestion();
  };

  const endHandler = () => {
    toast.success(`Test tugadi. Sizning ballingiz: ${score}/${totalAnswered}`);
    navigate("/public-tests");
  };

  const correctAnswer = currentQuestion?.answers?.find((a) => a.ok === true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-teal-700 p-4 relative">
      <div className="max-w-xl w-full text-center shadow-xl p-8 rounded-2xl border border-teal-200 bg-white relative">
        <div className="text-blue-700 font-bold text-lg animate-pulse absolute top-8 right-8 z-20">
          {timeLeft}s
        </div>

        <h2 className="text-2xl font-bold mb-6 px-8">
          {currentQuestion?.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion?.answers?.map((answer) => (
            <button
              key={answer._id}
              onClick={() => handleAnswer(answer._id)}
              disabled={answered}
              className={`w-full border rounded-2xl px-4 py-3 flex items-center justify-between text-left transition-all duration-200 ${
                answered
                  ? correctAnswer._id === answer._id
                    ? "bg-teal-100 border-teal-500"
                    : selected === answer._id
                    ? "bg-red-100 border-red-500"
                    : "border-teal-200"
                  : selected === answer._id
                  ? "bg-teal-100 border-teal-500"
                  : "border-teal-200 hover:bg-teal-50"
              }`}
            >
              <span>{answer.name}</span>
              {answered ? (
                correctAnswer._id === answer._id ? (
                  <FaCheckCircle className="text-teal-600" />
                ) : selected === answer._id ? (
                  <FaTimesCircle className="text-red-600" />
                ) : (
                  <FaRegCircle className="text-teal-400" />
                )
              ) : (
                <FaRegCircle className="text-teal-400" />
              )}
            </button>
          ))}

          <button
            onClick={endHandler}
            className="mt-6 px-6 py-3 flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 transition rounded-xl cursor-pointer shadow-lg"
          >
            <FaTimesCircle className="text-white text-xl" />
            Tugatish
          </button>
        </div>
      </div>
    </div>
  );
}
