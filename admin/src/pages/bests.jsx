import React, { useEffect, useState } from "react";
import { FaPlus, FaStar, FaUpload, FaUser } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { showLoad, hideLoad } from "../reducers/load";
import { axios1 } from "../api/api";
import Modal from "../components/modal";
import { toast } from "react-toastify";

const Bests = () => {
  const [leaders, setLeaders] = useState([]);
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(4)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    username: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async() => {
    if (!formData.username || !formData.image) {
      toast.error("Barcha maydonlarni to‘ldiring!");
      return;
    }
    dispatch(showLoad())
    const data = new FormData()
    data.append("username", formData.username)
    data.append("image", formData.image)
    
    try {
      const response = await axios1.post(`/api/album/create`, data) 
      if(response.data.ok){
        await getAllBests()
        toast.success(response.data.message)
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  };

  const getAllBests = async () => {
    dispatch(showLoad())
    try {
      const res = await axios1.get(`/api/album/${index}/get-all/admin`)
      if (res.data.ok) {
        setLeaders(res.data.data)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi")
    }
    dispatch(hideLoad())
  }


  const deleteBestHandler = async (id) => {
    const del = confirm("Chindan ham o'chirmoqchimisiz!")
    if(!del){
      return
    }
    dispatch(showLoad())
    try {
      const response = await axios1.delete(`/api/album/delete/${id}`)
      if(response.data.ok){
        await getAllBests()
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    getAllBests()
  }, []);

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 fixed w-[73%] p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">🏆 Eng Yaxshilar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Faol va eng yuqori ball to‘plaganlar ro‘yxati
          </p>
        </div>
        <button onClick={() => setOpen(true) } className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow transition">
          <FaPlus /> Qo‘shish
        </button>
      </div>

      <div className="grid grid-cols-1 mt-32 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {leaders.length > 0 ? leaders.map(({ _id, user, image }) => (
          <div
          key={_id}
          className="bg-white rounded-xl shadow-lg p-2 text-center hover:shadow-xl transition"
        >
          <img
            src={image}
            alt={user?.username}
            className="w-full h-36 object-fill mx-auto border-2 border-teal-500 shadow-md"
          />
          <div className="mt-4 px-2 space-y-1 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-1">
              <AiOutlineUser className="text-teal-700 text-2xl"/> {user?.username} {user?.surname}
            </h3>
            <p className="text-xl text-gray-600 flex items-center justify-center gap-1">
              <MdSchool className="text-blue-500" /> {user?.userClass}
            </p>
          </div>

          <button onClick={() => deleteBestHandler(_id)} className="bg-red-700 w-full rounded-sm py-1 hover:opacity-80 active:opacity-60 cursor-pointer my-2 text-white">O'chirish</button>
        </div>
        )) : <div className="text-center w-full">Hozircha Birorta ham o'quvchi sertifikat olmagan!</div>}
      </div>

      <Modal isOpen={open} onClose={() => setOpen((prev) => !prev)} title={"O'quvchi qo'shish"}>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-teal-500" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Foydalanuvchi ismi"
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <FaUpload className="text-teal-500" />
            <label
              htmlFor="studentImage"
              className="cursor-pointer bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-md border"
            >
              Rasm yuklash
            </label>
            <input
              type="file"
              id="studentImage"
              name="image"
              onChange={handleChange}
              hidden
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-12 h-12 rounded-full object-cover border"
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md font-semibold"
          >
            Saqlash
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Bests;
