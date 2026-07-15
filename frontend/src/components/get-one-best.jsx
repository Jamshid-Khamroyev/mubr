import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa'; // Orqaga qaytish ikonkasi
import { useNavigate, useParams } from 'react-router-dom'; // `navigate` uchun import
import { FaCrown, FaShieldAlt, FaRocket, FaUserAlt } from 'react-icons/fa'; // Ballar uchun ikonalar
import { axios } from '../api';
import LazyLoad from './lazyImage';
import { useDispatch } from 'react-redux';
import { hideLoad, showLoad } from '../reducers/load';

const GetOneBest = () => {
  const [user, setUser] = useState(null)
  const { id } = useParams()
  const dispatch = useDispatch()
  const getTopPerformers = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get(`/api/album/get-one/${id}`); 
      if (response.data.ok) {
        setUser(response.data.data); 
      }
    } catch (error) {
      console.error("Error fetching performers:", error);
    }
    dispatch(hideLoad())
  };
  const navigate = useNavigate();

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

  useEffect(() => {
    getTopPerformers()
  }, [])

  return (
    <div className="min-h-screen bg-teal-50 md:p-4 p-1 mt-16 flex flex-col items-center justify-start">
      <button
        onClick={() => navigate(-1)} 
        className="absolute cursor-pointer top-18 left-0 bg-teal-600 text-white p-3 rounded-full shadow-md"
      >
        <FaArrowLeft />
      </button>

      <div className="w-full max-w-3xl my-6">
        <LazyLoad src={user?.image} height='h-full'/>
      </div>

      <div className="text-center">
        <div className='flex justify-between items-center gap-2'>
          <div className="mb-6">{getUserIcon(user?.user?.balls)}</div>
          <h2 className="text-2xl font-bold text-teal-700 mb-2">{user?.user?.username} {user?.user?.surname}</h2>
        </div>
        <p className="text-xl font-semibold text-teal-500">Ballar: {user?.user?.balls}</p>
      </div>
    </div>
  );
};

export default GetOneBest;
