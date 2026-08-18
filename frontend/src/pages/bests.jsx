import React, { useState, useEffect } from "react";
import { FaTrophy, FaUser, FaStar, FaUserAlt, FaRocket, FaShieldAlt, FaCrown } from "react-icons/fa"; // Ikonkalar importi
import { axios } from "../api"; 
import { useDispatch, useSelector } from "react-redux";
import LazyLoad from '../components/lazyImage'
import { hideLoad, showLoad } from "../reducers/load";
import { useNavigate } from "react-router-dom";
import notFound from '../assets/not-found.png'


const Bests = () => {
  const [performers, setPerformers] = useState([]) 
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getUserIcon = (balls) => {
    if (balls >= 150) {
      return <FaCrown className="text-yellow-400 text-4xl p-1 rounded-full border" />;
    } else if (balls >= 100) {
      return <FaShieldAlt className="text-teal-600 text-4xl p-1 rounded-full border" />;
    } else if (balls >= 50) {
      return <FaRocket className="text-green-500 text-4xl p-1 rounded-full border" />;
    } else {
      return <FaUserAlt className="text-4xl p-1 rounded-full border" />;
    }
  };


  const getTopPerformers = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get(`/api/album/4/get-all`); 
      if (response.data.ok) {
        setPerformers(response.data.data); 
      }
    } catch (error) {
      console.error("Error fetching performers:", error);
    }
    dispatch(hideLoad())
  };

  useEffect(() => {
    getTopPerformers();
  }, []);

  return (
      <div className="bg-white min-h-[80vh] p-2 mt-24">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FaTrophy className="text-yellow-500 text-3xl" />
          <h2 className="text-3xl font-bold capitalize text-teal-700">{user?.siteId?.title}ning A'lolari</h2>
        </div>
        
        {performers.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performers.length && performers?.map((performer, index) => (
              <div key={performer?._id} onClick={() => navigate(`/best/${performer?._id}`)} className="bg-white border border-teal-200 rounded-sm shadow-lg">
                <LazyLoad src={performer?.image} height="h-44" widht="w-full"/>
                <div className="p-1 border-t border-teal-300">
                  <div className="flex items-center justify-start gap-2 p-1">
                    <div className="flex items-center gap-2 text-teal-500 mb-3">
                      {getUserIcon(performer?.user?.balls)}
                    </div>

                    <h3 className="text-xl font-semibold text-teal-600 mb-2">
                      {performer?.user?.username || "Maxfiy"} {performer?.user?.surname || "Maxfiy"}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <img src={notFound} alt="not found" className="w-72" />
          </div>
        )}
      </div>
  )
}

export default Bests