import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { FaUsers, FaInfoCircle, FaCalendarAlt, FaCheckCircle, FaUser, FaTrophy } from "react-icons/fa"
import { FiUserPlus } from "react-icons/fi"
import Modal from "../components/modal"
import upload from '../assets/upload.jpg'
import { axios1 } from "../api/api"
import { showLoad, hideLoad } from "../reducers/load"

const Teams = () => {
  const [teams, setTeams] = useState([])
  const { link } = useSelector(state => state.load)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    capitan: "",
    image: null,
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const dispatch = useDispatch()

  const getAllTeams = async () => {
    dispatch(showLoad())
    try {
      const res = await axios1.get("/api/team/get-all/admin")
      if (res.data.ok) {
        setTeams(res.data.data)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi")
    }
    dispatch(hideLoad())
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoad())
    if(!formData.image || !formData.title || !formData.description || !formData.capitan){
      return toast.warn("Siz barcha kataklarni to'ldirmadingiz!")
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("capitan", formData.capitan);
    data.append("image", formData.image);
  
    try {
      const res = await axios1.post("/api/team/create", data);
      if (res.data.ok) {
        setFormData({
          title: "",
          description: "",
          capitan: "",
          image: null,
        })
        await getAllTeams();
        toast.success("Jamoa muvaffaqiyatli qo‘shildi!");
        setOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi!");
    }
    dispatch(hideLoad())
  };

  const deleteTeamHandler = async (id) => {
    const del = confirm("Chindan ham o'chirmoqchimisiz!")
    if(!del){
      return
    }
    dispatch(showLoad())
    try {
      const response = await axios1.delete(`/api/team/delete/${id}`)
      if(response.data.ok){
        await getAllTeams()
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    getAllTeams()
  }, [])

  return (
    <div className="p-6 w-full space-y-6">
      <div className="bg-white dark:bg-slate-800 fixed w-[73%] p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Jamoalar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Bu sahifada barcha tizimdagi jamoalar ro‘yxati bilan tanishishingiz mumkin.
          </p>
        </div>
        <button
          className="flex items-center cursor-pointer gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-lg transition"
          onClick={() => setOpen(true)}
        >
          <FiUserPlus size={18} />
          Jamoa qo‘shish
        </button>
      </div>

      <div className="grid mt-32 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team?._id} className="bg-white relative dark:bg-slate-800 rounded-sm shadow p-2 space-y-2 text-slate-800 dark:text-white">
              <img
                src={`${link}/api/team-images/${team?.image}`} // bu yerda `image` to‘liq URL yoki API path bo‘lishi kerak
                alt={team?.title}
                className="w-full h-52 object-fill rounded-sm"
              />

              <h2 className="text-xl font-bold">{team?.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300 h-28 overflow-y-scroll scroolNone">{team?.description}</p>

                <div className="flex flex-col space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  <span>Sardor: {team?.capitan}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-orange-500" />
                  <span>A'zolar: {team?.users?.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  <span>Ball: {team?.balls}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" />
                  <span>Qo‘shilgan: {new Date(team?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
                <button onClick={() => deleteTeamHandler(team?._id)} className="px-4 py-1.5 absolute bottom-2 right-2 rounded-sm text-white bg-red-400 hover:bg-red-800 cursor-pointer active:bg-red-900">
                  O'chirish
                </button>
              </div>
          ))
        ) : (
          <p className="text-slate-500 text-center col-span-full">Hozircha jamoa mavjud emas.</p>
        )}
      </div>

      <Modal title={"Jamoa qo‘shish"} isOpen={open} onClose={() => setOpen(false)}>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="space-y-4"
          encType="multipart/form-data"
        >
           <div>
            <label className="w-full cursor-pointer" htmlFor="Teamimage">
              <img src={formData.image ? URL.createObjectURL(formData.image) : upload} alt="fs" className="h-52 w-full"/>
            </label>
            <input
              type="file"
              name="image"
              id="Teamimage"
              onChange={handleImageChange}
              hidden
              className="w-full bg-white p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Jamoa nomi</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Jamoani nomini kiriting..."
              className="w-full p-2 rounded-sm bg-slate-100 dark:bg-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Jamoa haqida</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Jamoa haqida yozing..."
              className="w-full p-2 rounded-sm bg-slate-100 dark:bg-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Sardor (email)</label>
            <input
              type="email"
              name="capitan"
              value={formData.capitan}
              onChange={handleChange}
              placeholder="Sardorni kiriting..."
              required
              className="w-full p-2 rounded-sm bg-slate-100 dark:bg-slate-700 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 cursor-pointer text-white font-medium px-4 py-2 rounded-lg"
          >
            Saqlash
          </button>
        </form>
      </Modal>

    </div>
  )
}

export default Teams
