import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FiAlertCircle } from "react-icons/fi";
import { axios } from "../api";
import { useDispatch } from "react-redux";
import { showLoad, hideLoad } from "../reducers/load";
import Modal from '../additional-pages/team-modal'

export default function GetOneTest() {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const getOneTest = async () => {
      dispatch(showLoad())
      try {
        const { data } = await axios.get(`/api/test/get-one/${id}`);
        if (data.ok) setTest(data.test);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Xatolik yuz berdi");
      }
      dispatch(hideLoad())
    };
    getOneTest();
  }, [id]);

  const complaintHandler = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.post(`/api/complaint/add/${id}`, { data: text })
      if(response.data.ok){
        setOpen(false)
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    if (!test) return;
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    if (timeLeft === 0) handleNext();
    return () => clearInterval(timer);
  }, [timeLeft, test]);

  const handleSelect = (answer, id) => {
    setSelected(answer);
    const savedAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
    savedAnswers.push({
      questionId: id,
      answerId: answer,
    });
    localStorage.setItem("testAnswers", JSON.stringify(savedAnswers));
    setTimeout(handleNext, 1000);
  };

  const handleNext = () => {
    if (index < test.questions.length - 1) {
      setIndex((prev) => prev + 1);
      setSelected(null);
      setTimeLeft(30);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    dispatch(showLoad());
    try {
      const data = JSON.parse(localStorage.getItem("testAnswers"));
      const response = await axios.put(`/api/test/cheking/${id}`, data);
  
      if (response.data.ok) {
        toast.success(`Siz ${response.data.total} dona testdan ${response.data.correct} tasini to'g'ri, ${response.data.incorrect} tasini noto'g'ri ishladingiz! O'rtacha foiz: ${response.data.percentage}%`);
        localStorage.removeItem("testAnswers");
        navigate("/tests");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      dispatch(hideLoad())
    }
  };
  

  if (!test) return <div className="flex justify-center items-center min-h-screen">Yuklanmoqda...</div>;

  const question = test.questions[index];

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white text-teal-700 md:p-4 p-2">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl px-3 shadow-lg relative">
        <h1 className="text-2xl font-bold px-8 text-wrap text-center mb-6">{question.name}</h1>
        <div className="space-y-4">
          {question.answers.map((a, i) => (
            <div
              key={i}
              onClick={() => handleSelect(a._id, question._id)}
              className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                selected === a.name ? "bg-teal-100 border-teal-600" : "bg-white border-teal-300 hover:bg-teal-50"
              }`}
            >
              {selected === a._id ? (
                <FaCheckCircle className="text-teal-700 mr-2" size={20} />
              ) : (
                <FaRegCircle className="text-gray-400 mr-2" size={20} />
              )}
              <span className="text-lg">{a.name}</span>
            </div>
          ))}
          <p className="text-xl">{index + 1}/{test.questions.length}</p>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center cursor-pointer gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl shadow-md transition duration-200"
          >
            <FiAlertCircle size={20} />
            Shikoyat qilish
          </button>
        </div>

        <div className="absolute top-2 right-2 text-sm">
          <span className={`${timeLeft < 10 ? "text-red-700 animate-pulse" : "text-teal-700"} font-semibold`}>
            Vaqt: {timeLeft}s
          </span>
        </div>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
          <h2 className="text-2xl font-bold my-2 text-center">Izoh yozing!</h2>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Izoh yozing..." className="w-full border border-teal-600 focus:border-2 p-2 outline-none rounded-sm"></textarea>
          <button onClick={complaintHandler} className="w-full p-2 rounded-sm border border-teal-600 hover:bg-teal-600 cursor-pointer duration-300 hover:text-white">Yuborish</button>
      </Modal>
    </div>
  );
}
