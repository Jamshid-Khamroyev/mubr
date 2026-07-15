import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showLoad, hideLoad } from "../../reducers/load";
import { toast } from "react-toastify";
import { axios1 } from "../../api/api";

export default function TestBuilder({ setOpen, getAllTests }) {
  const [userClass, setUserClass] = useState("");
  const [testType, setTestType] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

  const dispatch = useDispatch()

  useEffect(() => {
    const saved = localStorage.getItem("questions");
    if (saved) {
      setQuestions(JSON.parse(saved));
    }
  }, []);

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
  };

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      alert("Savol matnini kiriting");
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert("Barcha variantlarni kiriting");
      return;
    }
    if (correctIndex === null) {
      alert("To‘g‘ri variantni tanlang");
      return;
    }

    const newQuestion = {
      name: questionText,
      answers: options.map((opt, i) => ({
        name: opt,
        okay: i === correctIndex
      }))
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    resetForm();
  };

  const handleSaveAll = async() => {
    dispatch(showLoad())
    if (!userClass.trim() || !testType.trim()) {
        dispatch(hideLoad())
        alert("Iltimos, sinf va test turini to‘ldiring");
      return;
    }

    const fullData = {
        forClass:userClass,
        testType,
        questions
    };

    try {
        const response = await axios1.post(`/api/test/create`, fullData)
        if(response.data.ok){
            await getAllTests()
            setOpen(false)
            toast(response.data.message)
            localStorage.removeItem("questions")
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  };

  const maxQuestions = 10;
  const isLimitReached = questions.length >= maxQuestions;

  return (
    <div className="max-w-xl mx-auto bg-slate-800 p-6 shadow rounded-xl space-y-4 mt-10 text-white">
      <h2 className="text-xl font-bold text-teal-400">Test Yaratish</h2>

      <div className="grid grid-cols-2 gap-4">
        <select
            value={userClass}
            onChange={(e) => setUserClass(e.target.value)}
            className="p-2 border rounded-sm cursor-pointer bg-slate-800 text-white outline-none"
        >
            <option value="">Sinfni tanlang</option>
            <option value="6-7">6-7-sinflar</option>
            <option value="8-9">8-9-sinflar</option>
            <option value="10-11">10-11-sinflar</option>
        </select>

        <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="p-2 border rounded-sm cursor-pointer bg-slate-800 text-white outline-none"
        >
            <option value="">Test turini tanlang</option>
            <option value="Aniq">Aniq</option>
            <option value="Tabiiy">Tabiiy</option>
        </select>
        </div>


      {!isLimitReached && (
        <>
          <input
            type="text"
            placeholder="Savol matni"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />

          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="relative flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  id={`option-${i}`}
                  className="peer hidden"
                  checked={correctIndex === i}
                />
                <div
                  onClick={() => setCorrectIndex(i)}
                  className="w-5 h-5 border-2 border-teal-500 cursor-pointer rounded-full flex items-center justify-center peer-checked:bg-teal-500 relative"
                >
                  {correctIndex === i && (
                    <span className="text-white cursor-pointer text-xs absolute">✓</span>
                  )}
                </div>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, i)}
                  placeholder={`Variant ${String.fromCharCode(65 + i)}`}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-between items-center pt-4">
        {!isLimitReached && (
          <button
            onClick={handleAddQuestion}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Yana qo‘shish
          </button>
        )}
        {isLimitReached && (
          <button
            onClick={handleSaveAll}
            className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Saqlash
          </button>
        )}
      </div>

      <p className="text-sm text-gray-300 text-right">
        Jami savollar: {questions.length} / {maxQuestions}
      </p>
    </div>
  );
}
