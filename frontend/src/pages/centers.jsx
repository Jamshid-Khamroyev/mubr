import React, { useState, useEffect } from "react";
import { FaBookOpen, FaInfoCircle, FaSchool, FaSearchLocation } from "react-icons/fa";
import { axios } from '../api/index';
import { toast } from "sonner";
import { Carousel } from 'react-responsive-carousel'; // Carousel import qilingan bo‘lishi kerak
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { useDispatch, useSelector } from "react-redux";
import LazyLoad from '../components/lazyImage'
import { useNavigate } from "react-router-dom";
import { hideLoad, showLoad } from "../reducers/load";

const Centers = () => {
  const navigate = useNavigate()
  const {link} = useSelector(state => state.load)
  const [num, setNum] = useState(4);
  const [centers, setCenters] = useState([]);
  const dispatch = useDispatch()

  const getAllCenters = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get(`/api/edu-center/${num}/get-all`);
      if (response.data.ok) {
        setCenters(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
    dispatch(hideLoad())
  };

  useEffect(() => {
    getAllCenters();
  }, []);

  return (
    <section className="pt-28 pb-12">
    <h2 className="Itim md:text-4xl text-3xl mb-4 text-center text-emerald-600">Tumanimizdagi o'quv markazlar!</h2>
    <div className="items-center bg-white p-6 text-teal-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
      {centers.map((eduCenter) => (
        <div key={eduCenter._id} className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-teal-200 overflow-hidden">
          <div>
          <Carousel showThumbs={false} infiniteLoop transitionTime={1000} interval={3000} autoPlay showArrows={false}>
            {eduCenter.images.map((img, index) => (
              <div key={index} className="p-1">
                <LazyLoad height="h-48" src={`${link}/api/edu-center/${img}`}/>
              </div>
            ))}
          </Carousel>
          </div>
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"><FaSchool />{eduCenter?.title}</h3>
            <p className="text-sm text-teal-600 mb-4 flex items-center w-full justify-center gap-2"><FaSearchLocation/>{eduCenter?.location}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => navigate(`/get-course/${eduCenter._id}`)} className="flex cursor-pointer items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium md:py-2 py-1 px-4 md:rounded-2xl rounded-md transition-all">
                <FaBookOpen className="md:text-3xl text-2xl"/> Kursga yozilish
              </button>
              <button onClick={() => navigate(`/center/${eduCenter._id}`)} className="flex cursor-pointer items-center gap-2 border border-teal-600 text-teal-600 hover:bg-teal-50 text-sm font-medium md:py-2 py-1 px-4 md:rounded-2xl rounded-md transition-all">
                <FaInfoCircle className="md:text-3xl text-2xl"/> Ko‘proq bilish
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </section>
  );
};

export default Centers;
