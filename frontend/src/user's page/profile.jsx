import { useState } from "react";
import { FaUser, FaSchool, FaMedal, FaUsers, FaCalendarAlt, FaCrown, FaShieldAlt, FaRocket, FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { axios } from "../api";
import { hideLoad, showLoad } from "../reducers/load";

export default function Profile() {
  const { user } = useSelector(state => state.user);
  const [bio, setBio] = useState(user.bio || "");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch()

  const getUserIcon = (balls) => {
    if (balls >= 150) {
      return <FaCrown className="text-yellow-400 md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
    } else if (balls >= 100) {
      return <FaShieldAlt className="text-teal-600 md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
    } else if (balls >= 50) {
      return <FaRocket className="text-green-500 md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
    } else {
      return <FaUserAlt className="md:text-7xl text-5xl p-1 md:mb-3 rounded-full border" />;
    }
  };

  const handleSave = async() => {
    dispatch(showLoad())
    try {
      const response = await axios.put(`/api/user/update`, { bio: bio })
      if(response.data.ok){
        toast.success(response.data.message)
      }
    } catch (error) {
       toast.error(error.response.data.message)
    }
    setIsEditing(false);
    dispatch(hideLoad())
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-teal-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        <div className="flex flex-col items-center text-center mb-6">
          {getUserIcon(user.balls)}
          <h2 className="text-2xl font-bold text-teal-700">{user.username} {user.surname}</h2>
          <p className="text-sm text-gray-500 mb-2">{user.usertype}</p>

          {isEditing ? (
            <div className="w-full">
              <textarea
                className="w-full border rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="mt-2 bg-teal-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
              >
                Saqlash
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-700">{bio}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 bg-teal-100 cursor-pointer text-teal-700 px-4 py-1 rounded-md hover:bg-teal-200 transition text-sm"
              >
                Bio'ni o'zgartirish
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FaMedal className="text-teal-400 text-xl" />
            <span className="text-gray-700 font-semibold">Ballar:</span>
            <span className="text-gray-900">{user.balls}</span>
          </div>

          {user.userTeam && (
            <div className="flex items-start gap-3">
              <FaUsers className="text-teal-400 text-xl mt-1" />
              <div>
                <p className="font-semibold text-gray-700">{user.userTeam.title}</p>
                <p className="text-gray-500 text-sm">{user.userTeam.description}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <FaSchool className="text-teal-400 text-xl" />
            <span className="text-gray-700 font-semibold">So'nggi Testlar:</span>
          </div>
          {user.lastTests && user.lastTests.length > 0 &&  user.lastTests.map((test) => (
            <div className="flex flex-col gap-2" key={test._id}>
              <div className="text-gray-600 border p-1 rounded-sm border-teal-500 text-sm">
                <p><strong>Fan:</strong> {test.testType}</p>
                <p className="flex items-center gap-1 mt-1">
                  <FaCalendarAlt className="text-teal-400" />
                  <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
