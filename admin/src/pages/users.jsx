import { toast } from "react-toastify"
import { axios1 } from '../api/api'
import { FaUser, FaEnvelope, FaSchool, FaLayerGroup, FaCheckCircle, FaTrophy } from "react-icons/fa";
import { FiUserPlus } from 'react-icons/fi'
import { MdOutlineBlock } from 'react-icons/md'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import Modal from '../components/modal'
import { showLoad, hideLoad } from '../reducers/load'

const Users = () => {
  const [open, setOpen]  = useState(false)
  const [users, setUser] = useState([])
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.user._id)

  const [formData, setFormData] = useState({
    username: "",
    surname: "",
    userClass: "",
    userEmail: "",
    userPassword: "",
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const registerHandler = async event => {
    dispatch(showLoad())
    event.preventDefault()
    if(!formData.surname || !formData.surname || !formData.userEmail || !formData.userPassword || !formData.userClass){
      return toast.warn("Siz barcha kataklarni to'ldirmadingiz!")
    }

    try {
      let data = null
      if(isNaN(formData.userClass.slice(0, 2))){
        data = {username: formData.username, surname: formData.surname, userEmail: formData.userEmail, userPassword: formData.userPassword, userClassNumber: Number(formData.userClass.slice(0, 1)), userClassName: formData.userClass.slice(2, 3)}
      }else {
        data = {username: formData.username, surname: formData.surname, userEmail: formData.userEmail, userPassword: formData.userPassword, userClassNumber: Number(formData.userClass.slice(0, 2)), userClassName: formData.userClass.slice(3, 4)}
      }
      const response = await axios1.post(`/api/user/register`, data)
      if(response.data.ok){
        await getAllUsers()
        toast.success(response.data.message)
        setOpen(false)
        setFormData({
          username: "",
          surname: "",
          userClass: "",
          userEmail: "",
          userPassword: "",
        })
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }
  
  const getAllUsers = async () => {
    dispatch(showLoad())
    try {
        const response = await axios1.get(`/api/user/get-all/admin`)
        if(response.data.ok){
            setUser(response.data.data)
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const blockUnblockhandler = async (id) => {
    dispatch(showLoad())
    try {
      const response = await axios1.put(`/api/user/block/${id}`)
      if(response.data.ok){
        await getAllUsers()
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  } 

  const deleteUser = async id => {
    const del = confirm("Chindan ham o'chirmoqchimisiz!")
    if(!del){
      return
    }
    dispatch(showLoad())
    try {
      const response = await axios1.delete(`/api/user/delete/${id}`)
      if(response.data.ok){
        await getAllUsers()
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  useEffect(() => {
    getAllUsers()
  },[])
  return (
    <div className="p-6 w-full space-y-6">
      <div className="bg-white dark:bg-slate-800 fixed w-[73%] p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">O‘quvchilar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Bu sahifada barcha tizimdagi o‘quvchilar ro‘yxati bilan tanishishingiz mumkin.
          </p>
        </div>
        <button
          className="flex items-center cursor-pointer gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-lg transition"
          onClick={() => setOpen(prev => !prev)}
        >
          <FiUserPlus size={18} />
          O‘quvchi qo‘shish
        </button>
      </div>

      <div className="grid mt-32 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users?.length > 0 ? (
          users?.map((user) => (
            <>
              {user._id !== currentUser ? (
                <div key={user._id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 space-y-3 text-slate-800 dark:text-white">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <FaUser className="text-teal-500" />
                    <span>{user?.username} {user?.surname}</span>
                  </div>
            
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                    <FaEnvelope className="text-blue-400" />
                    <span>{user?.userEmail}</span>
                  </div>
            
                  <div className="flex items-center gap-2 text-sm">
                    <FaSchool className="text-orange-400" />
                    <span>{user?.userClassNumber}-{user?.userClassName} sinf o'quvchisi</span>
                    <FaLayerGroup className="ml-4 text-purple-400" />
                    <span>{user?.usertype}</span>
                  </div>
            
                  <div className="flex items-center gap-2 text-sm">
                    <FaTrophy className="text-yellow-500" />
                    <span>Ball: <strong>{user?.balls}</strong></span>
                  </div>
            
                  <div className="flex items-center gap-2 text-sm">
                    {user?.block ? (
                      <>
                        <MdOutlineBlock className="text-red-500" />
                        <span className="text-red-500">Bloklangan</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-green-500" />
                        <span className="text-green-500">Faol</span>
                      </>
                    )}
                  </div>
                  <div className="w-full flex items-center justify-between gap-2">
                    <div className="text-xs text-slate-400">
                      Qo‘shilgan sana: {new Date(user?.createdAt).toLocaleDateString()}
                    </div>
                    {user && user?.block ? (
                        <button onClick={() => blockUnblockhandler(user?._id)} className="px-2 py-1.5 rounded-sm text-white bg-green-600 hover:bg-green-800 cursor-pointer active:bg-green-900">
                          Blockdan chiqarish
                        </button>
                    ) : (
                      <button onClick={() => blockUnblockhandler(user?._id)} className="px-4 py-1.5 rounded-sm text-white bg-yellow-400 hover:bg-yellow-800 cursor-pointer active:bg-yellow-900">
                        Bloklash
                      </button>
                    )}

                    <button onClick={() => deleteUser(user?._id)} className="px-4 py-1.5 rounded-sm text-white bg-red-400 hover:bg-red-800 cursor-pointer active:bg-red-900">
                      O'shirish
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-center col-span-full">Hozircha o‘quvchi mavjud emas.</p>
              )}
            </>
          ))
        ) : (
          <p className="text-slate-500 text-center col-span-full">Hozircha o‘quvchi mavjud emas.</p>
        )}

      <Modal title={"O'quvchi qo'shish"} isOpen={open} onClose={() => setOpen(false)}>
        <form
          className="space-y-4"
          onSubmit={registerHandler}
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ismi"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 outline-none w-full"
              required
            />

            <input
              type="text"
              placeholder="Familiyasi"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 outline-none w-full"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 outline-none w-full"
            required
          />

          <input
            type="password"
            placeholder="Parol"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleChange}
            className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 outline-none w-full"
            required
          />

          <select
            name="userClass"
            value={formData.userClass}
            onChange={handleChange}
            className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 outline-none w-full"
            required
          >
            <option value="">Sinfni tanlang</option>
            <option value="6-A">6-A</option>
            <option value="6-B">6-B</option>
            <option value="6-D">6-D</option>
            <option value="6-E">6-E</option>

            <option value="7-A">7-A</option>
            <option value="7-B">7-B</option>
            <option value="7-D">7-D</option>
            <option value="7-E">7-E</option>

            <option value="8-A">8-A</option>
            <option value="8-B">8-B</option>
            <option value="8-D">8-D</option>
            <option value="8-E">8-E</option>

            <option value="9-A">9-A</option>
            <option value="9-B">9-B</option>
            <option value="9-D">9-D</option>
            <option value="9-E">9-E</option>

            <option value="10-A">10-A</option>
            <option value="10-B">10-B</option>
            <option value="10-D">10-D</option>
            <option value="10-E">10-E</option>

            <option value="11-A">11-A</option>
            <option value="11-B">11-B</option>
            <option value="11-D">11-D</option>
            <option value="11-E">11-E</option>
          </select>

          <button
            type="submit"
            className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium"
          >
            Qo'shish
          </button>
        </form>
      </Modal>

      </div>
    </div>
  )
}

export default Users