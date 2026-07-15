import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSchool,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { axios } from "../../api/index";
import { toast } from "sonner";
import { showLoad, hideLoad } from '../../reducers/load';
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "../../reducers/user";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState([])
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const getUser = async () => {
    dispatch(showLoad())
    try {
        const response = await axios.get(`/api/user/get-my`)
        dispatch(LoginUser(response.data.data))
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const getAllSite = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get(`/api/site/get-all-site-for-user`)
      if(response.data.ok){
        setData(response.data.data)
      }else{
        toast.error(response.data.message)
      } 
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(showLoad());
    try {
      const data = {
        userEmail: email,
        userPassword: password,
      };
  
      const response = await axios.post(`/api/user/login/${school}`, data);
  
      if (response?.data?.ok) {
        await getUser()
        navigate("/")
      } else {
        toast.error("Login amalga oshmadi!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xatolik yuz berdi");
    }
    dispatch(hideLoad());
  };
  

  useEffect(() => {
    getAllSite()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <FaSignInAlt /> Kirish
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1">Maktabni tanlang</label>
            <div className="flex items-center gap-2 bg-white/20 p-2 rounded-lg">
              <FaSchool />
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="bg-transparent outline-none flex-1"
                required
              >
                <option value="" disabled>
                  Maktabni tanlang
                </option>
                {data.map((s, i) => (
                  <option value={s._id} key={i} className="text-black">
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <div className="flex items-center gap-2 bg-white/20 p-2 rounded-lg">
              <FaEnvelope />
              <input
                type="email"
                placeholder="you@example.com"
                className="bg-transparent outline-none flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Parol</label>
            <div className="flex items-center gap-2 bg-white/20 p-2 rounded-lg relative">
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Parolni kiriting"
                className="bg-transparent outline-none flex-1 pr-8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-white/70" />
                ) : (
                  <FaEye className="text-white/70" />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-600 cursor-pointer transition-all duration-300 rounded-lg py-2 font-semibold"
          >
            Kirish
          </button>
        </form>

        <p className="text-sm mt-4 text-center opacity-80">
          <p className="text-center mb-1">Hisobingiz yo‘qmi?{" "}</p>
          <span className="cursor-pointer mt-2 text-[16px]">Foydalanuvchilar faqat o'z maktablarining adminlari orqali bu platformada ro'yxatdan o'tishlari mumkin!</span>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
