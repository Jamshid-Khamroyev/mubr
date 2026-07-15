import { useEffect, useState } from "react";
import { FaBookOpen, FaCheckCircle, FaCalendarAlt, FaTrashAlt, FaEdit, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { axios } from "../api";
import Modal from "../additional-pages/team-modal";
import { hideLoad, showLoad } from "../reducers/load";

export default function MyTests() {
  const { user } = useSelector(state => state.user);
  const [tests, setTests] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Track if we're editing or adding a new test
  const [editData, setEditData] = useState(null);
  const dispatch = useDispatch();

  const getTests = async () => {
    dispatch(showLoad());
    try {
      const response = await axios.get(`/api/public/test/get-all-for-user`);
      if (response.data.ok) {
        setTests(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
    dispatch(hideLoad());
  };

  const deleteTest = async (id) => {
    if (!confirm("Testni o'chirmoqchimisiz?")) return;
    dispatch(showLoad());
    try {
      const response = await axios.delete(`/api/public/test/delete/${id}`);
      if (response.data.ok) {
        toast.success("Test o'chirildi!");
        setTests(tests.filter(test => test._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "O'chirishda xatolik");
    }
    dispatch(hideLoad());
  };

  const updateTest = (id) => {
    const selectedTest = tests.find(test => test._id === id);
    setEditData(selectedTest); 
    setIsEdit(true);
    setOpen(true);
  };

  const handleChange = (e, idx = null, field = null) => {
    if (!editData) return;
    if (idx === null) {
      setEditData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    } else {
      setEditData(prev => {
        const updatedAnswers = [...prev.answers];
        if (field === "name") {
          updatedAnswers[idx].name = e.target.value;
        } else if (field === "ok") {
          updatedAnswers[idx].ok = !updatedAnswers[idx].ok;
        }
        return { ...prev, answers: updatedAnswers };
      });
    }
  };

  const saveChanges = async () => {
    dispatch(showLoad());
    if (!editData.question.trim()) {
      toast.error("Savol maydoni bo'sh bo'lishi mumkin emas!");
      dispatch(hideLoad())
      return;
    }

    let correctAnswerCount = 0;

    for (const answer of editData.answers) {
      if (!answer.name.trim()) {
        toast.error("Javob matni bo'sh bo'lishi mumkin emas!");
        dispatch(hideLoad())
        return;
      }

      if (answer.ok) {
        correctAnswerCount++;
      }
    }

    if (correctAnswerCount === 0 || correctAnswerCount > 1) {
      toast.error("Bitta to'g'ri javob bo'lishi kerak!");
      dispatch(hideLoad())
      return;
    }

    try {
      const response = isEdit
        ? await axios.put(`/api/public/test/update/${editData._id}`, editData)
        : await axios.post(`/api/public/test/create`, editData); 

      if (response.data.ok) {
        toast.success(isEdit ? "Test yangilandi!" : "Yangi test yaratildi!");
        setTests(isEdit ? tests.map(t => t._id === editData._id ? editData : t) : [...tests, response.data.data]);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || (isEdit ? "Yangilashda xatolik" : "Test yaratishda xatolik"));
    }
    dispatch(hideLoad());
  };

  const openAddTestModal = () => {
    setEditData({ question: "", answers:   [{ name: "", ok: false }, { name: "", ok: false }, { name: "", ok: false }, { name: "", ok: false }] });
    setIsEdit(false);
    setOpen(true);
  };

  useEffect(() => {
    getTests();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-teal-50 p-6">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-teal-700 text-center mb-6">Mening Testlarim</h2>

        <div className="flex justify-center items-center mb-4">
          <button
            onClick={openAddTestModal}
            className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Yangi Test Qo'shish
          </button>
        </div>

        <div className="space-y-4 max-md:flex-col flex w-full justify-center gap-3">
          {(!tests || tests.length === 0) ? (
            <p className="text-center text-gray-500">Siz hali test topshirmagansiz.</p>
          ) : (
            tests.map((test, idx) => (
              <div key={idx} className="bg-white cursor-pointer rounded-2xl shadow-md p-4 group transition hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <FaBookOpen className="text-teal-400 text-2xl mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-gray-700">{test?.question || "Test nomi"}</h3>
                    <p className="text-gray-500 text-sm">
                      <span className="font-semibold text-gray-600">Ko'rilgan:</span> {test.see}
                    </p>
                    <p className="flex items-center text-gray-400 text-xs mt-2 gap-1">
                      <FaCalendarAlt className="text-teal-400" />
                      {test?.createdAt ? new Date(test.createdAt).toLocaleDateString() : "Sana mavjud emas"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-3 mt-4">
                  <button 
                    onClick={() => updateTest(test._id)} 
                    className="flex items-center gap-1 text-blue-500 text-xs font-semibold hover:underline"
                  >
                    <FaEdit /> Tahrirlash
                  </button>

                  <button 
                    onClick={() => deleteTest(test._id)} 
                    className="flex items-center gap-1 text-red-500 text-xs font-semibold hover:underline"
                  >
                    <FaTrashAlt /> O'chirish
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Modal isOpen={open} onClose={() => { setOpen(false); setEditData(null); }}>
          {editData && (
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-teal-700 mb-4">{isEdit ? "Testni tahrirlash" : "Yangi Test Qo'shish"}</h3>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Savol</label>
                <input
                  type="text"
                  name="question"
                  value={editData.question}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 mb-1 block">Javoblar</label>
                {editData.answers.map((answer, idx) => (
                  <div key={answer._id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={answer.name}
                      onChange={(e) => handleChange(e, idx, "name")}
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <button
                      onClick={() => handleChange(null, idx, "ok")}
                      className={`p-2 rounded-full ${answer.ok ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      {answer.ok ? <FaCheck className="text-white" /> : <FaTimes className="text-white" />}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={saveChanges}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Saqlash
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
