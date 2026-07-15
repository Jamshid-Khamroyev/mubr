import { useEffect, useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaSchool, FaUserShield } from "react-icons/fa";
import { axios1 } from "../api/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { LoginUser, Logout } from "../reducers/user"

const Login = () => {
  const dispatch = useDispatch()
  const [timeLeft, setTimeLeft] = useState(300); // 5 daqiqa = 300 sekund
  const [schools, setSchools] = useState([])
  const [showPassword, setShowPassword] = useState(false);
  const [start, setStart] = useState(false);
  const [isValidCode, setIsValidCode] = useState(true);
  const [user, setUser] = useState("")
  const [data, setData] = useState({
    school: "",
    email: "",
    password: "",
    code: "",
  });

  const getAllScholl = async () => {
    try {
      const response = await axios1.get(`/api/site/get-all-site-for-user`)
      if(response.data.ok){
        setSchools(response.data.data)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!data.code){
      return toast.error("Maxfiy raqamni kiritishingiz kerak!")
    }

    try {
      const response = await axios1.put(`/api/user/verification/${user}`, { code: data.code })
      if(response.data.ok){
        toast.success(response.data.message)
        setStart(true)
        dispatch(LoginUser(response.data.data))
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  const handleLoginSubmit = async(e) => {
    e.preventDefault();
    try {
      const userData = { userEmail: data.email, userPassword: data.password }
      const response = await axios1.post(`/api/user/login/${data.school}`, userData)
      if(response.data.ok){
        setIsValidCode(false)
        setUser(response.data.data)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  // Sekundomerni boshqarish
  useEffect(() => {
    if (timeLeft <= 0) return;
    if(isValidCode) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isValidCode]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };


  useEffect(() =>{
    getAllScholl()
  },[])
  if (start) {
    return (
      <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-slate-900 flex items-center justify-center text-white">
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-[90%] max-w-md space-y-6">
          <div className="flex flex-col items-center gap-2">
            <FaUserShield size={40} className="text-teal-400" />
            <h2 className="text-2xl font-bold">Siz muvaffaqiyatli tizimga kirdingiz!</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-slate-900 flex items-center justify-center text-white">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-[90%] max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <FaUserShield size={40} className="text-teal-400" />
          <h2 className="text-2xl font-bold">Administrator</h2>
        </div>

        {!isValidCode ? (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="text-center text-white">
            <p>
              Biz sizning emailingizga 6 xonali maxfiy raqam yubordik! Siz u kodni bu yerga kiritishingiz kerak!
            </p>
            <p className="mt-2 text-teal-300 font-semibold text-lg">
              Kod muddati: {formatTime(timeLeft)}
            </p>
          </div>
    
          <div className="flex items-center gap-3 bg-slate-700 p-3 rounded-md">
            <input
              type="text"
              name="code"
              value={data.code}
              onChange={handleChange}
              maxLength="6"
              pattern="\d{6}"
              placeholder="6 Xonali Raqam"
              className="bg-transparent outline-none text-white w-full placeholder-slate-400"
            />
          </div>
    
          <button
            type="submit"
            className="bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors p-3 rounded-md font-semibold"
            disabled={timeLeft <= 0}
          >
            Raqamni Tekshirish
          </button>
    
          {data.code.length > 0 && data.code.length < 6 && (
            <p className="text-red-500 text-center mt-2">Raqam 6 xonali bo'lishi kerak.</p>
          )}
          {data.code.length === 6 && isNaN(data.code) && (
            <p className="text-red-500 text-center mt-2">Faqat raqam kiriting.</p>
          )}
    
          {timeLeft <= 0 && (
            <p className="text-orange-400 text-center mt-2">
              ⏱ Kod muddati tugadi. Qaytadan yuborishni so'rang.
            </p>
          )}
        </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="flex flex-col space-y-4">
            <div className="flex items-center gap-3 bg-slate-700 p-3 rounded-md">
              <FaSchool size={20} className="text-slate-400" />
              <select
                name="school"
                value={data.school}
                onChange={handleChange}
                className="bg-transparent cursor-pointer outline-none w-full placeholder-white"
              >
                <option className="text-slate-800" value="">
                  Maktabingizni tanlang!
                </option>
               {schools?.length > 0 && schools?.map(school => (
                  <option key={school?._id} className="text-slate-800" value={school._id}>
                    {school.title}
                  </option>
               ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-slate-700 p-3 rounded-md">
              <FiMail size={20} className="text-slate-400" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email"
                className="bg-transparent outline-none text-white w-full placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-700 p-3 rounded-md">
              <FiLock size={20} className="text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Parol"
                className="bg-transparent outline-none text-white w-full placeholder-slate-400"
              />
              <button type="button" onClick={togglePassword}>
                {showPassword ? (
                  <FiEyeOff size={20} className="text-slate-400" />
                ) : (
                  <FiEye size={20} className="text-slate-400" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 cursor-pointer transition-colors p-3 rounded-md font-semibold"
            >
              Kirish
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;