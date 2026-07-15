import { NavLink } from "react-router-dom";
import { FiUser, FiFolder, FiBook, FiBell, FiBarChart2, FiHelpCircle } from "react-icons/fi";
import { FaUsers, FaTrophy, FaCertificate, FaCommentDots } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { useSelector } from "react-redux";

const sidebarLinks = [
  { name: "O'quvchilar", path: "/", icon: <FiUser size={20} /> },
  { name: "Jamoalar", path: "/teams", icon: <FaUsers size={20} /> },
  { name: "Testlar", path: "/tests", icon: <FiFolder size={20} /> },
  { name: "Kutubxona", path: "/library", icon: <MdLibraryBooks size={20} /> },
  { name: "A'lolar", path: "/bests", icon: <FaTrophy size={20} /> },
  { name: "Sertifikat berish", path: "/prize", icon: <FaCertificate size={20} /> },
  { name: "Statistika", path: "/statistics", icon: <FiBarChart2 size={20} /> },
  { name: "Shikoyatlar", path: "/complaints", icon: <FaCommentDots size={20} /> },
  { name: "Qo'llab-quvvatlash", path: "/helps", icon: <FiHelpCircle size={20} /> },
];

const SideBar = () => {
  const site = useSelector(state => state?.user?.user?.siteId)
  return (
    <div className="h-screen md:w-[30vw] bg-slate-900 text-slate-100 p-4 border-r flex flex-col">
      <div className="text-2xl font-bold mb-8 border-b pb-1 text-center">{site?.title} uchun Admin Panel</div>

      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-teal-500 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`
            }
          >
            {link.icon}
            <span className="text-base">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
