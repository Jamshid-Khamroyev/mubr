import { FaTrophy, FaUsers, FaClipboardList, FaCalendarAlt } from "react-icons/fa"; // Iconlar uchun
import { useSelector } from "react-redux";

export default function MyAchive() {
  const { user } = useSelector(state => state.user)

  return (
    <div className="p-6 mt-24 space-y-4">
      <h3 className="md:text-3xl text-2xl font-bold text-teal-700 text-center mb-4">Mening Yutuqlarim</h3>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <FaTrophy className="text-yellow-500 text-3xl" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Yig'ilgan ballar</h4>
            <p className="text-gray-500">{user?.balls} ball</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <FaUsers className="text-teal-500 text-3xl" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Jamoa: {user?.userTeam?.title}</h4>
            <p className="text-gray-500">{user?.userTeam?.description}</p>
            <p className="text-sm text-gray-400 mt-1">Kapitan: {user?.userTeam?.capitan}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <FaClipboardList className="text-teal-400 text-3xl" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Oxirgi Test</h4>
            <p className="text-gray-500">{user?.lastTests[0]?.testType || "Test tipi yo'q"} {user?.userClass?.includes("10") || user?.userClass?.includes("11") ? "Umumiy fanlardan" : "fanlar bo'yicha" }</p>
            <p className="text-sm text-gray-400 mt-1">
              <FaCalendarAlt className="inline text-teal-400" /> {new Date(user.lastTests[0]?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
