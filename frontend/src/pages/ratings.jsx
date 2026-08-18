import { useEffect, useState } from "react";
import { FaMedal, FaAward, FaUserAlt, FaTrophy, FaShieldAlt, FaCrown, FaRocket, FaUsers, FaSchool, FaUserFriends } from "react-icons/fa";
import { FaUser, FaBolt } from "react-icons/fa"
import { toast } from "sonner";
import { axios } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { hideLoad, showLoad } from "../reducers/load";
import { useNavigate } from "react-router-dom";

const getUserIcon = (balls) => {
  if (balls >= 150) return <FaCrown className="text-yellow-400 text-4xl" />;
  if (balls >= 100) return <FaShieldAlt className="text-teal-600 text-4xl" />;
  if (balls >= 50) return <FaRocket className="text-green-500 text-4xl" />;
  return <FaUserAlt className="text-gray-400 text-4xl" />;
};

const trophyIcon = (index) => {
  if (index === 0) return <FaTrophy className="text-yellow-500 text-xl" />;
  if (index === 1) return <FaAward className="text-gray-400 text-xl" />;
  if (index === 2) return <FaMedal className="text-amber-700 text-xl" />;
  return null;
};

const Ratings = () => {
  const currentUser = useSelector((state) => state.user.user);
  const { link } = useSelector(state => state.load)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [filteredTeams, setfilteredTeams] = useState([])
  const [filteredBy, setFilteredBy] = useState("class"); // class | team | school

  const getAllTeams = async () => {
    dispatch(showLoad())
    try {
        const response = await axios.get(`/api/team/get-all`)
        if(response.data.ok){
          dispatch(hideLoad())
          setfilteredTeams(response.data.data)
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
    dispatch(hideLoad())
  }

  const getAllUsers = async () => {
    dispatch(showLoad());
    try {
      const response = await axios.get(`/api/user/get-all`);
      if (response.data.ok) {
        const sorted = response.data.data.sort((a, b) => b.balls - a.balls);
        setUsers(sorted);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi.");
    }
    dispatch(hideLoad());
  };

  useEffect(() => {
    getAllTeams()
  },[filteredBy])

  useEffect(() => {
    getAllUsers();
  }, []);

  const getFilteredUsers = () => {
    if (!currentUser) return [];

    if (filteredBy === "school") {
      return users
    }

    if (filteredBy === "class") {
      return users.filter(
        (u) =>
          u.userClassNumber === currentUser.userClassNumber &&
          u.userClassNumber === currentUser.userClassNumber
      );
    }

    return [];
  };

  const getUserTeamOk = (team) => {
    return team.users.map(user => {
      if(user._id == currentUser._id){
        return true
      }else{
        return false
      }
    })
  }


  const filteredUsers = getFilteredUsers().sort((a, b) => b.balls - a.balls);

  return (
    <section className="pt-24 pb-12 min-h-[96vh] w-full px-4">
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => setFilteredBy("class")}
          className={`px-4 py-2 rounded-xl border cursor-pointer transition ${filteredBy === "class" ? "bg-teal-600 text-white" : "bg-white border-teal-300 text-teal-600"}`}
        >
          <FaUserFriends className="inline-block mr-2" />
          Sinfdoshlar
        </button>
        <button
          onClick={() => setFilteredBy("team")}
          className={`px-4 py-2 rounded-xl border cursor-pointer transition ${filteredBy === "team" ? "bg-teal-600 text-white" : "bg-white border-teal-300 text-teal-600"}`}
        >
          <FaUsers className="inline-block mr-2" />
          Jamoa
        </button>
        <button
          onClick={() => setFilteredBy("school")}
          className={`px-4 py-2 rounded-xl border cursor-pointer transition ${filteredBy === "school" ? "bg-teal-600 text-white" : "bg-white border-teal-300 text-teal-600"}`}
        >
          <FaSchool className="inline-block mr-2" />
          Maktab
        </button>
      </div>

      <div className="text-center text-2xl font-bold text-teal-700 mb-6">
        {filteredBy === "class" && "Sinfdoshlar Reytingi"}
        {filteredBy === "team" && "Jamoalar Reytingi"}
        {filteredBy === "school" && `${currentUser?.siteId?.title} Reytingi`}
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {filteredBy === "team" ? (
          filteredTeams?.map((team, index) => (
            <div key={team._id} className={`p-6 rounded-2xl shadow-md ${getUserTeamOk(team) ? "border-4 border-teal-600" : "border border-teal-300"} bg-white flex flex-col sm:flex-row items-start sm:items-center gap-6`}>
              <img
                src={`${link}/api/team-images/${team?.image}`}
                alt={team?.title}
                className="w-24 h-24 cursor-pointer rounded-full object-cover border-4 border-teal-400 shadow"
              />

              <div className="flex-1 w-full space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-teal-800 flex items-center gap-2">
                    <FaUsers className="text-teal-500" /> {index + 1}-o‘rin — {team.title}
                  </h3>
                  <div className="text-teal-700 font-bold text-lg flex items-center gap-2">
                    <FaBolt /> {team.balls} ball
                    {trophyIcon(index)}
                  </div>
                </div>

                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <FaCrown className="text-yellow-500" />
                  <span className="font-medium">Kapitan:</span> {team.capitan}
                </div>

                {team.description && (
                  <div className="text-sm text-gray-600 italic">{team.description}</div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {team.users.map((member) => (
                    <span
                      key={member._id}
                      onClick={() => navigate(`/user/${member._id}`)}
                      className="bg-teal-100 hover:bg-teal-200 transition text-sm text-teal-800 px-3 py-1 rounded-full cursor-pointer flex items-center gap-1"
                    >
                      <FaUser />
                      {member.surname} {member.username?.charAt(0)}.
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredUsers.map((user, index) => (
            <div
              key={user._id}
              className={`flex items-center justify-between p-4 rounded-xl shadow border transition-all duration-200 ${
                currentUser._id === user._id
                  ? "border-4 border-teal-500"
                  : "border-teal-300 bg-white"
              }`}
              onClick={() => navigate(`/user/${user._id}`)}
            >
              <div className="flex items-center gap-4">
                {getUserIcon(user.balls)}
                <div>
                  <div className="font-semibold text-lg">{index + 1}-o‘rin</div>
                  <div className="text-teal-800 capitalize">
                    {user.surname} {user.username?.charAt(0)}. | {user.userClassNumber}-{user.userClassName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-teal-700 font-bold text-xl">{user.balls}</span>
                {trophyIcon(index)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Ratings;
