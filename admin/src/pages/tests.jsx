import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axios1 } from "../api/api";
import Modal from "../components/modal";
import { FiFilePlus } from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoad, hideLoad } from '../reducers/load';
import image67 from '../assets/6-7.png';
import image89 from '../assets/8-9.png';
import image1011 from '../assets/10-11.png';
import image10112 from '../assets/10-11-taabiiy.png';
import Variants from '../components/test/variants'

const Tests = () => {
  const [open, setOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    testType: "",
    forClass: "",
  });

  const getAllTests = async () => {
    dispatch(showLoad());
    try {
      const res = await axios1.get("/api/test/get-all/admin");
      if (res.data.ok) {
        setTests(res.data.data);
      }
    } catch (err) {
      toast.error("Testlarni olishda xatolik yuz berdi");
    }
    dispatch(hideLoad());
  };

  const deleteHandler = async (id) => {
    const del = confirm("Chindan ham o'chirmoqchimisiz!")
    if(!del){
      return
    }
    dispatch(showLoad())
    try {
        const response = await axios1.delete(`/api/test/delete/${id}`)
        if(response.data.ok){
          await getAllTests()
          toast.success(response.data.message)
        }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    getAllTests();
  }, []);

  const getImageForClass = (forClass, testType) => {
    const classNum = parseInt(forClass);
    if (classNum >= 6 && classNum <= 7) return image67;
    if (classNum >= 8 && classNum <= 9) return image89;
    if ((classNum === 10 || classNum === 11) && testType === "Yakuniy") return image10112;
    if (classNum === 10 || classNum === 11) return image1011;
    return image67;
  };

  return (
    <div className="p-6 w-full space-y-6">
      <div className="bg-white dark:bg-slate-800 fixed z-10 w-[73%] p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Testlar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Bu sahifada barcha testlar ro‘yxati bilan tanishishingiz mumkin.
          </p>
        </div>
        <button
          className="flex items-center cursor-pointer gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-lg transition"
          onClick={() => setOpen(true)}
        >
          <FiFilePlus size={18} />
          Test qo‘shish
        </button>
      </div>

      {/* Test Cards */}
      <div className="grid mt-32 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {tests.length ? (
          tests.map((test) => {
            const image = getImageForClass(test.forClass, test.testType);
            return (
              <div
                key={test._id}
                className="bg-white relative dark:bg-slate-800 rounded-sm shadow overflow-hidden text-slate-800 dark:text-white flex flex-col"
              >
                <img src={image} alt="Test" className="h-52 w-full object-fill" />

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaFileAlt className="text-teal-500" />
                    {test.testType} testi
                  </h2>

                  <div className="text-sm text-slate-500 space-y-1">
                    <p><span className="font-medium">📘 Sinf:</span> {test?.forClass}</p>
                    <p><span className="font-medium">❓ Savollar:</span> {test?.questions?.length}</p>
                    <p><span className="font-medium">🗓 Sana:</span> {new Date(test?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deleteHandler(test._id)} className="py-1.5 px-4 rounded-sm bg-red-500 text-white cursor-pointer hover:opacity-80 active:opacity-70">O'chirish</button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-slate-500">Hozircha testlar mavjud emas.</p>
        )}
      </div>

      {/* Modal */}
      <Modal title="Yangi test qo‘shish" isOpen={open} onClose={() => setOpen(false)}>
        {<Variants getAllTests={getAllTests} setOpen={setOpen}/>}
      </Modal>
    </div>
  );
};

export default Tests;
