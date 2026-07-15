import {
  FiUsers, FiTrendingUp, FiPhone, FiBook, FiFlag,
  FiLock, FiCheckCircle
} from "react-icons/fi";
import { FaAward, FaCrown, FaMedal, FaTrophy, FaUserFriends, FaUserShield } from "react-icons/fa";
import { BsPersonCheck } from "react-icons/bs";
import { useState, useEffect, useCallback } from "react";
import { axios } from "../api/index"; 
import { NavLink } from "react-router-dom";
import { hideLoad, showLoad } from "../reducers/load";
import { useDispatch } from "react-redux";

const Schools = () => {
  const [schoolsData, setSchoolsData] = useState([]);
  const dispatch = useDispatch()

    const getAllStats = useCallback(async() => {
      dispatch(showLoad())
        try {
            const response = await axios.get("/api/site/stats-press");  
            if (response.data.ok) {
              const data = response.data.data;
              const sortedData = data.sort((a, b) => b.avgBalls - a.avgBalls);
              setSchoolsData(sortedData)
            }
        } catch (error) {
            console.error("Xatolik:", error.message);
        }
        dispatch(hideLoad())
    },[])

    const getIcon = i => {
      if(i === 1) return <FaCrown className="text-yellow-400"/>
      if(i === 2) return <FaAward className="text-gray-400"/>
      if(i === 3) return <FaMedal className="text-yellow-700"/>
    }

    useEffect(() => {
      getAllStats()
    },[])

  return (
    <div className="w-full h-full p-6 text-white">
      <div className="grid grid-cols-1 gap-6">
        {schoolsData.length > 0 && schoolsData.map((school, index) => (
          <NavLink to={`/schools/${school.schoolId}`} className="bg-slate-800 w-full p-8 rounded-md shadow-lg hover:shadow-2xl transition-all space-y-6">
            
            {/* Sarlavha va telefon */}
            <div className="flex justify-between items-start border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-2xl flex items-center gap-2 font-bold text-white mb-1">
                  {getIcon(index + 1)}
                  {school.schoolName}
                </h2>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <FiPhone className="text-slate-500" /> {school.adminPhone}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Yangilandi: {new Date(school.updatedAt).toLocaleDateString("en-US")}
              </p>
            </div>

            {/* Statistikalar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm text-slate-300">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FiUsers size={20} className="text-teal-400" />
                  <p className="text-white font-semibold">Foydalanuvchilar</p>
                </div>
                <p>{school.totalUsers}</p>
              </div>


              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FaTrophy size={20} className="text-yellow-400" />
                  <p className="text-white font-semibold">Top foydalanuvchi</p>
                </div>
                <p>{school.bestUser} ({school.bestUserBalls} ball)</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <BsPersonCheck size={20} className="text-green-400" />
                  <p className="text-white font-semibold">Sertifikat</p>
                </div>
                <p>{school.certifiedUsers}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FiTrendingUp size={20} className="text-purple-400" />
                  <p className="text-white font-semibold">Yangi foydalanuvchilar</p>
                </div>
                <p>{school.newUsersLast7Days}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FaUserFriends size={20} className="text-orange-400" />
                  <p className="text-white font-semibold">Jamoada</p>
                </div>
                <p>{school.usersWithTeam}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FiBook size={20} className="text-cyan-400" />
                  <p className="text-white font-semibold">Kitob / Test</p>
                </div>
                <p>{school.totalBooks} / {school.totalTests}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FiFlag size={20} className="text-red-400" />
                  <p className="text-white font-semibold">Shikoyatlar</p>
                </div>
                <p>{school.complaintsCount}</p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FaUserShield size={20} className="text-blue-400" />
                  <p className="text-white font-semibold">Bloklanganlar</p>
                </div>
                <p>{school.blockedUsers}</p>
              </div>
            </div>

            {/* O'rtacha ball */}
            <div className="pt-4 border-t border-slate-700 text-sm text-slate-300">
              O'rtacha ball: <span className="text-white font-semibold">{school.avgBalls}</span>
            </div>
          </NavLink>
        ))}
      </div>

    </div>
  );
};

export default Schools