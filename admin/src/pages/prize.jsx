import { useEffect, useState } from "react";
import { FaGift, FaCrown, FaUserGraduate, FaSchool, FaFeatherAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { axios1 } from "../api/api";
import { useDispatch } from "react-redux";
import { hideLoad, showLoad } from "../reducers/load";
import { toast } from "react-toastify";
import Modal from "../components/modal";
import { FaUser, FaEnvelope, FaSignature } from "react-icons/fa";


const Prize = () => {
  const [users, setUsers] = useState([]);
  const [current, setCurrent] = useState(null)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  
  const getOneUser = async (id) => {
    dispatch(showLoad())
    try { 
        const response = await axios1.get(`/api/user/get-one/${id}`)
        if(response.data.ok){
          setCurrent(response.data.data)
          setOpen(true)
        }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  } 

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setCurrent(prev => ({...prev, [name]: value}))
  }

  const getAllUsers = async () => {
    dispatch(showLoad())
    try {
      const res = await axios1.get(`/api/user/get-all/admin`)
      if (res.data.ok) {
        const data = res.data.data 
        const topUsers = data.filter((user) => {
          const cert = user?.sertificate ?? 0;
          const requiredBalls = (cert + 1) * 150;
          return user.balls >= requiredBalls;
        });
        setUsers(topUsers);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi")
    }
    dispatch(hideLoad())
  }

  const submitHandler = async () => {
    dispatch(showLoad())
    try {
      const data = {userId: current._id, username: current.username, surname: current.surname, middlename: current.dad}
      const response = await axios1.post(`/api/user/sertificate`, data, {responseType: "blob"})
      setOpen(false)
      await getAllUsers()
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    getAllUsers()
  }, []);

  return (
    <div className="w-full mx-auto px-4 py-6 space-y-6">
      <div className="bg-white dark:bg-slate-800 fixed w-[73%] p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10">
          <div>
            <h1 className="text-3xl mb-2 font-bold text-teal-600 flex items-center gap-2">
              <FaCrown className="text-yellow-500" />
              Mukofotga loyiq o‘quvchilar
            </h1>
            <p className="text-gray-500 text-sm">150+ ball to‘plagan eng faol foydalanuvchilar</p>
            </div>
            <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md">
              <FaGift />
              Sovg‘a qo‘shish
          </button>
        </div>
        
      {users?.length > 0 ? (
        <div className="grid md:grid-cols-2 mt-32 lg:grid-cols-3 gap-6">
          {users?.map((user, idx) => (
            <div
            key={user?._id}
            className="relative border-white/20 border group rounded-sm h-80 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent group-hover:via-black/60 transition-all duration-300" />
          
            <div className="absolute top-3 left-3 bg-teal-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {user?.balls} ball
            </div>
          
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 group-hover:translate-y-0 translate-y-10 opacity-0 group-hover:opacity-100">
              <h2 className="text-lg font-semibold">{user?.username} {user?.surname}</h2>
              <p className="text-sm flex items-center gap-2 mt-1">
                <FaUserGraduate className="text-teal-300" /> {user?.userClass}
              </p>
              <p className="text-sm flex items-center gap-2">
                <MdOutlineEmail className="text-teal-300" /> {user?.userEmail}
              </p>
              <button onClick={() => getOneUser(user._id)} className="flex my-3 cursor-pointer items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md">
                <FaGift />
                Sovg‘a qo‘shish
              </button>
            </div>
          </div>
          
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-32 text-lg">
          Hozircha hech kim yetarli ball to‘plamagan 😔
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title="O‘quvchi ma’lumotlari">
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-teal-500" />
            <input
              type="text"
              name="username"
              value={current?.username}
              onChange={handleChange}
              placeholder="Ism"
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <FaCrown className="text-teal-500" />
            <input
              type="text"
              name="dad"
              value={current?.dad}
              onChange={handleChange}
              placeholder="Otasining ismi!"
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="flex items-center gap-3">
          <FaSignature className="text-teal-500" />
            <input
              type="text"
              name="surname"
              value={current?.surname}
              onChange={handleChange}
              placeholder="Familiya"
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={submitHandler}
            className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white py-2 px-4 rounded-md"
          >
            Yuborish
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default Prize;
