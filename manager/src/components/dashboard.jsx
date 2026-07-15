import { useState, useEffect, useCallback } from "react";
import { axios } from "../api/index";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"; // Recharts kutubxonasidan import qilish
import { FiUsers, FiTrendingUp } from "react-icons/fi"; // Ba'zi ikonalar
import { useDispatch } from "react-redux";
import { hideLoad, showLoad } from "../reducers/load";

const Dashboard = () => {
  const [schoolsData, setSchoolsData] = useState([]);
  const [newSchools, setNewSchools] = useState([]);
  const [weekStats, setWeekStats] = useState({ totalUsers: 0, participated: 0, notParticipated: 0 });
  const [weeklyScores, setWeeklyScores] = useState([]);
  const dispatch = useDispatch()

  const getAllStats = useCallback(async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get("/api/site/stats-press");  
      if (response.data.ok) {
        const data = response.data.data;

        const sortedData = data.sort((a, b) => b.avgBalls - a.avgBalls);
        setSchoolsData(sortedData);

        let participated = 0;
        let notParticipated = 0;
        let totalUsers = 0;
        let scores = [];

        data.forEach(school => {
          totalUsers += school.totalUsers;
          if (school.totalTests > 0) participated += school.usersWithTeam;
          else notParticipated += school.totalUsers - school.usersWithTeam;
          
          scores.push({ name: school.schoolName, score: school.avgBalls });
        });

        setWeekStats({ totalUsers, participated, notParticipated });
        setWeeklyScores(scores);

      }
    } catch (error) {
      console.error("Xatolik:", error.message);
    }
    dispatch(hideLoad())
  }, []);

  useEffect(() => {
    getAllStats();
  }, []);

  return (
    <div className="w-full h-full p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">Maktablar Statistikasi</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
        {/* Yangiliklar qismini qo'shish */}
        <div className="bg-slate-800 p-6 rounded-sm shadow-md hover:shadow-2xl transition-shadow space-y-4">
          <h2 className="text-xl font-bold">Yangiliklar</h2>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <FiUsers size={20} className="text-teal-400" />
              <p>{weekStats.totalUsers} umumiy foydalanuvchi</p>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp size={20} className="text-purple-400" />
              <p>{weekStats.participated} testda ishtirok etdi</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <FiTrendingUp size={20} className="text-red-400" />
              <p>{weekStats.notParticipated} testda ishtirok etmagan</p>
            </div>
          </div>
        </div>

        {/* Grafiklar: O'rtacha ballar va ishtirok etganlar */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-shadow space-y-4 col-span-2">
          <h2 className="text-xl font-bold">O'rtacha Ballar</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Testlarda ishtirok etganlar */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-2xl transition-shadow space-y-4 col-span-2">
          <h2 className="text-xl font-bold">Testlarda Ishtirok Etganlar</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Ishtirok Etgan', value: weekStats.participated },
                  { name: 'Ishtirok Etmagan', value: weekStats.notParticipated },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#82ca9d" />
                <Cell fill="#ff8042" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
