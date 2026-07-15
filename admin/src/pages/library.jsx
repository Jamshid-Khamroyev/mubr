import { FaCalendarAlt, FaInfoCircle, FaStar } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";
import { FiFilePlus, FiImage } from "react-icons/fi";
import { FaRegFileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { axios1 } from '../api/api'
import { useEffect, useState } from "react";
import upload from '../assets/upload.jpg'
import { useDispatch } from "react-redux";
import { showLoad, hideLoad } from '../reducers/load'
import Modal from '../components/modal'

const Library = () => {
    const [books, setBooks] = useState([])
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
      title: "",
      description: "",
      goal: "",
      image: "",
    });
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

  
    const getAllBooks = async () => {
      dispatch(showLoad())
      try {
          const response = await axios1.get(`/api/book/get-all/admin`)
          if(response.data.ok){
            setBooks(response.data.data)
          }
      } catch (error) {
        toast.error(error.response.data.message)
      }
      dispatch(hideLoad())
    }

    const handlerSubmit = async () => {
      dispatch(showLoad())
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("goal", formData.goal)
      data.append("image", formData.image)

      try {
        const response = await axios1.post(`/api/book/create`, data)
        if(response.data.ok){
          await getAllBooks()
          setFormData({
            title: "",
            description: "",
            goal: "",
            image: "",
          })
          setOpen(false)
          toast.success(response.data.message)
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
      dispatch(hideLoad())
    }

    const handleDelete = async (id) => {
      const del = confirm("Chindan ham o'chirmoqchimisiz!")
      if(!del){
        return
      }
      dispatch(showLoad())
      try {
        const response = await axios1.delete(`/api/book/delete/${id}`)
        if(response.data.ok){
          await getAllBooks()
          toast.success(response.data.message)
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
      dispatch(hideLoad())
    }

    useEffect(() => {
      getAllBooks()
    },[])

  return (
    <div className="p-6 w-full space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kitoblar Kutubxonasi</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Bu sahifada mavjud bo‘lgan kitoblar bilan tanishishingiz mumkin.
          </p>
        </div>
        <button
          className="flex items-center cursor-pointer gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-lg transition"
          onClick={() => setOpen(true)}
        >
          <FiFilePlus size={18} />
          Kitob qo‘shish
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.length > 0 ? books.map(book => (
          <div key={book._id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 space-y-2 text-slate-800 dark:text-white">
            <img
              src={book?.image}
              alt={book?.title}
              className="w-full h-64 object-fill rounded-md"
            />

            <h2 className="text-xl font-bold">{book?.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300 overflow-y-auto scroolNone">
              {book?.goal}
            </p>

            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span>Reyting: {book?.rating.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-500" />
                <span>Qo‘shilgan: {new Date(book?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                <span>ID: {book?._id}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(book._id)}
              className="bg-red-500 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:bg-red-600"
            >
              O'chirish
            </button>
          </div>
        )) : (
          <p className="text-gray-400 text-center">Hozircha hech qanday kitob mavjud emas!</p>
        )}
      </div>
      <Modal isOpen={open} onClose={() => setOpen(prev => !prev)} title="Kitob qo'shish">
        <div className="space-y-4 p-4 w-full">
        <div className="relative flex w-full justify-center items-center gap-3">
            <label htmlFor="bookImage" className="cursor-pointer">
              <img
                src={formData.image ? URL.createObjectURL(formData.image) : upload}
                alt="Yuklash"
                className="w-full h-52 object-fill rounded-md border"
              />
            </label>
            <input
              type="file"
              hidden
              id="bookImage"
              name="image"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
              }
            />
          </div>

          <div className="relative">
            <FaBook className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Kitob nomi"
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="relative">
            <FaRegFileAlt className="absolute left-3 top-3 text-teal-500" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tavsif"
              rows={3}
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="relative">
            <BiTargetLock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Maqsad"
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button onClick={handlerSubmit} className="w-full py-2 rounded-sm bg-slate-800 text-white border cursor-pointer hover:border-slate-800 duration-300 hover:bg-white hover:text-slate-800">Qo'shish</button>
        </div>
      </Modal>
    </div>
  );
};

export default Library;
