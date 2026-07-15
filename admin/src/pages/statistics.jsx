import { useState, useEffect } from "react";
import { FaUsers, FaAward, FaChartLine, FaBookOpen, FaListUl, FaBrain, FaCrown } from "react-icons/fa";
import { toast } from "react-toastify";
import { axios1 } from '../api/api';
import { useDispatch, useSelector } from "react-redux";
import { showLoad, hideLoad } from '../reducers/load';
import { Link } from "react-router-dom";

const Statistics = () => {
  const site = useSelector(state => state?.user?.user?.siteId?._id);
  const [stats, setStats] = useState(null);
  const dispatch = useDispatch();

  const getSchool = async () => {
    dispatch(showLoad());
    try {
      const response = await axios1.get(`/api/site/get-stats/${site}`);
      if (response.data.ok) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'An error occurred');
    }
    dispatch(hideLoad());
  };

  useEffect(() => {
    if (site) {
      getSchool();
    }
  }, [site]);

  return (
    <div className="w-full">
      <div className="grid mt-8 items-center md:grid-cols-3 gap-6">
        <Link to={`/`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4">
          <FaUsers className="text-blue-500 text-3xl" />
          <div>
            <h4 className="text-gray-600 text-sm">Jami foydalanuvchilar</h4>
            <p className="text-xl font-bold">{stats?.totalUsers}</p>
          </div>
        </Link>

        <Link to={`/`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4">
          <FaAward className="text-yellow-500 text-3xl" />
          <div>
            <h4 className="text-gray-600 text-sm">Mukofotga loyiq</h4>
            <p className="text-xl font-bold">{stats?.topUsers}</p>
          </div>
        </Link>

        <Link to={`/`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4">
          <FaChartLine className="text-green-500 text-3xl" />
          <div>
            <h4 className="text-gray-600 text-sm">Eng faol foydalanuvchi</h4>
            <p className="text-md">{stats?.bestUser}</p>
            <p className="text-xs text-gray-400">{stats?.bestUserBalls} ball</p>
          </div>
        </Link>

        <Link to={`/`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4">
          <FaBrain className="text-purple-500 text-3xl" />
          <div>
            <h4 className="text-gray-600 text-sm">O‘rtacha ball</h4>
            <p className="text-xl font-bold">{stats?.avgBalls.toFixed(2)}</p>
          </div>
        </Link>

        <Link to={`/library`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4">
          <FaBookOpen className="text-pink-500 text-3xl" />
          <div>
            <h4 className="text-gray-600 text-sm">Kitoblar soni</h4>
            <p className="text-xl font-bold">{stats?.books}</p>
          </div>
        </Link>

        <Link to={`/tests`} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center gap-4">
          <FaListUl className="text-indigo-500 text-3xl" />
          <div>
            <h4 className="text-gray-600 text-sm">Testlar soni</h4>
            <p className="text-xl font-bold">{stats?.tests}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Statistics;
