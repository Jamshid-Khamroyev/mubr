import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiFileText
} from "react-icons/fi";

const menuItems = [
  { icon: <FiHome />, title: "Dashboard", path: "/dashboard" },
  { icon: <FiUsers />, title: "Maktablar", path: "/schools" },
  { icon: <FiBook />, title: "Testlar", path: "/tests" },
  { icon: <FiBarChart2 />, title: "Reytinglar", path: "/ratings" },
  { icon: <FiBell />, title: "Yangiliklar", path: "/news" },
  { icon: <FiFileText />, title: "Fikrlar", path: "/feedback" },
  { icon: <FiSettings />, title: "Sozlamalar", path: "/settings" },
];

const SideBar = () => {
  return (
    <div className="w-[27vw] min-h-screen bg-slate-800 text-slate-200 shadow-lg p-6">
      <h2 className="text-xl text-center font-bold mb-8 text-white">
        Uzun tumani Xalq ta'limi bo'limi
      </h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 select-none px-4 py-3 rounded-md transition-all ${
                isActive
                  ? "bg-slate-600 text-white font-semibold"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
