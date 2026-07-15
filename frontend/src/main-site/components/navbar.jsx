import { Link } from "react-router-dom";
import Logo from "../assets/logo1.png";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaHome, FaStar, FaComment, FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const [active, setActive] = useState("asosiy");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "asosiy", route: "/", icon: <FaHome /> },
    { name: "afzalliklar", route: "/advantage", icon: <FaStar /> },
    { name: "sharxlar", route: "/coment", icon: <FaComment /> },
    { name: "kirish", route: "/login", icon: <FaSignInAlt /> },
  ];

  return (
    <header className="w-full border-b py-3 md:px-5 px-2 flex justify-between items-center bg-white/10 backdrop-blur-md text-white fixed top-0 left-0 z-50">
      <Link
        to="/"
        onClick={() => setActive("asosiy")}
        className="flex items-center cursor-pointer gap-2"
      >
        <img
          src={Logo}
          alt="logo"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <h2 className="text-2xl font-bold">MUBR</h2>
      </Link>

      {/* Desktop links (iconlarsiz) */}
      <ul className="hidden md:flex gap-6 items-center">
        {links.map((link) => (
          <Link
            onClick={() => setActive(link.name)}
            key={link.name}
            to={link.route}
            className={`capitalize transition-all duration-200 ${
              link.name === active ? "scale-110 font-bold" : "scale-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </ul>

      {/* Mobile Menu Icon */}
      <div className="md:hidden cursor-pointer">
        <button onClick={() => setMenuOpen(true)} className="cursor-pointer">
          <FaBars size={24} className="cursor-pointer"/>
        </button>
      </div>

      {/* Slide-in Mobile Menu (iconlar ko‘rinadi) */}
      {menuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 right-0 w-[100%] h-full bg-gradient-to-br from-indigo-700 to-purple-700 text-white z-50 shadow-lg flex flex-col"
        >
          <div className="flex justify-between p-5 items-center">
            <h3 className="text-xl font-bold">Menyu</h3>
            <FaTimes
              size={22}
              className="cursor-pointer"
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <div className="flex flex-col w-full gap-7 py-4 my-1 px-4 bg-gradient-to-br from-indigo-700 to-purple-700">
            {links.map((link, i) => (
                <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className=""
                >
                <Link
                    to={link.route}
                    onClick={() => {
                    setActive(link.name);
                    setMenuOpen(false);
                    }}
                    className={`capitalize flex items-center gap-2 text-lg hover:translate-x-1 transition-transform ${
                    link.name === active ? "font-bold text-yellow-300" : ""
                    }`}
                >
                    {link.icon} {link.name}
                </Link>
                </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
