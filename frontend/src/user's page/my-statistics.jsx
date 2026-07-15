import { FaListOl, FaStar, FaUsersCog, FaClock, FaCheck } from "react-icons/fa"; // Iconlar
import { useSelector } from "react-redux";

export default function MyStatistics() {
  const { user } = useSelector(state => state.user)

  return (
    <div className="p-6 space-y-4 mt-24">
      <h3 className="md:text-3xl text-2xl text-center font-bold text-teal-700 mb-4">Statistikam</h3>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <FaListOl className="text-indigo-500 text-3xl" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Topshirilgan testlar</h4>
            <p className="text-gray-500">{user?.lastTests?.length} ta</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <FaStar className="text-yellow-500 text-3xl" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Shaxsiy ballar</h4>
            <p className="text-gray-500">{user?.balls} ball</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <FaUsersCog className="text-green-500 text-3xl" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Jamoa ballari</h4>
            <p className="text-gray-500">{user?.userTeam?.balls} ball</p>
          </div>
        </div>
      </div>

      {/* Team Join Date */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <FaClock className="text-teal-400 text-3xl" />
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Jamoaga qo'shilgan vaqt</h4>
            <p className="text-gray-500">
              {new Date(user?.userTeam?.createdAt)?.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
