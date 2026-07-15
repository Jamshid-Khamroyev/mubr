import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle, FaBell, FaTasks, FaTrophy, FaChartPie, FaLightbulb, FaSmile, FaUser, FaCrown, FaShieldAlt, FaRocket, FaUserAlt, FaRoad } from "react-icons/fa"; // kerakli ikonkalardan foydalanamiz
import { navLinks, userMenuLinks } from "./helpers"; // alohida fayldan import qilingan deb olaylik
import { toast } from "sonner";
import { LogoutUser } from '../reducers/user'
import { showLoad, hideLoad } from '../reducers/load'
import { axios } from "../api";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null)
  const [openPanel, setOpenPanel] = useState(false);
  const [openNavbar, setOpenNavbar] = useState(false); // Navbarni ochish uchun alohida holat

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutUser = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.patch("/api/user/logout")
      if(response.data.ok){
        dispatch(LogoutUser())
        localStorage.removeItem("school")
        navigate("/login")
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const getUserIcon = (balls) => {
    if (balls >= 150) {
      return <FaCrown className="text-yellow-400 text-4xl p-1 rounded-full border" />;
    } else if (balls >= 100) {
      return <FaShieldAlt className="text-teal-600 text-4xl p-1 rounded-full border" />;
    } else if (balls >= 50) {
      return <FaRocket className="text-green-500 text-4xl p-1 rounded-full border" />;
    } else {
      return <FaUserAlt className="text-4xl p-1 rounded-full border" />;
    }
  };

  const getMy = async () => {
    try {
      const response = await axios.get(`/api/user/get-my`)
      if(response.data.ok){
        setUser(response.data.data)
      }else {
        dispatch(LogoutUser())
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    getMy()
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-teal-800/70 backdrop-blur-md shadow-md"
          : "bg-teal-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="text-white text-2xl font-bold capitalize" >{user?.siteId ? user?.siteId?.title : "loading..."}</Link>

        <div className="hidden md:flex space-x-6">
          {navLinks.map(({ route, name, icon: Icon }) => (
            <NavLink
              key={route}
              to={route}
              className={({ isActive }) =>
                `text-white font-medium flex items-center gap-2 ${
                  isActive
                    ? "underline underline-offset-4"
                    : "hover:text-teal-100"
                }`
              }
            >
              <div className="md:hidden">
                <Icon className="text-xl" />
              </div>
              {name}
            </NavLink>
          ))}
        </div>

         <div className="md:hidden">
          {openNavbar && (
            <div className="absolute border-t top-16 left-0 w-full bg-teal-600 text-white shadow-lg py-2 transition-all duration-300">
              {navLinks.map(({ route, name, icon: Icon }) => (
                <Link
                  key={route}
                  to={route}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-teal-700 transition"
                  onClick={() => setOpenNavbar(false)}
                >
                  <Icon className="text-xl" />
                  <span>{name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Icon */}
        <div className="relative">
          <div className="flex justify-center items-center gap-2">
            <button
                onClick={() => setOpenNavbar(!openNavbar)}
                className="text-white md:hidden text-2xl"
              >
              <FaBars className="text-3xl cursor-pointer" />
            </button>
            <button
              onClick={() => setOpenPanel(!openPanel)}
              className="text-white text-2xl cursor-pointer"
            >
              {getUserIcon(user?.balls)}
            </button>
          </div>

          {openPanel && (
            <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded-md shadow-lg py-2 z-50 transition-all duration-300">
               {user && (
                  <div className="text-center p-2 border-b border-gray-200 mb-2">
                    <h1 className="text-lg font-semibold text-teal-700">
                      {user.username} {user.surname}
                    </h1>
                  </div>
                )}
              {userMenuLinks.map(({ route, name, icon: Icon }) => (
                <Link
                  key={route}
                  to={route}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-300 transition"
                  onClick={() => setOpenPanel(false)}
                >
                  <Icon className="text-teal-600 opacity-80 text-lg" />
                  <span>{name}</span>
                </Link>
              ))}
              <button
                className="w-full cursor-pointer text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-300 transition"
                onClick={logoutUser}
              >
                <FaUser className="text-red-700"/>
                <span>Chiqish</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
