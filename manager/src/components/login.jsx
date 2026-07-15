import { useEffect, useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { axios } from "../api/index";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { showLoad, hideLoad } from "../reducers/load"

const Login = ({ getMy }) => {
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });



  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async(e) => {
    dispatch(showLoad())
    e.preventDefault();
    try {
      const userData = { userEmail: data.email, userPassword: data.password }
      const response = await axios.post(`/api/user/login-press`, userData)
      if(response.data.ok){ 
        toast(response.data.message)
        await getMy()
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  };

  return (
    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-slate-900 flex items-center justify-center text-white">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-[90%] max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <FaUserShield size={40} className="text-teal-400" />
          <h2 className="text-2xl font-bold">Administrator</h2>
        </div>
          <form onSubmit={handleLoginSubmit} className="flex flex-col space-y-4">
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
      </div>
    </div>
  );
};

export default Login;
