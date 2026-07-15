import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axios } from '../api';
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import LazyLoad from '../components/lazyImage';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaArrowLeft, FaSchool, FaMapMarkerAlt, FaAward, FaBookOpen, FaInfoCircle } from "react-icons/fa";
import { hideLoad, showLoad } from "../reducers/load";

const GetOneCenter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { link } = useSelector(state => state.load);
  
  const [center, setCenter] = useState(null);

  const getCenter = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get(`/api/edu-center/get-one/${id}`);
      if (response.data.ok) {
        setCenter(response.data.data);
      } else {
        toast.error("O'quv markazini olishda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    }
    dispatch(hideLoad())
  };

  useEffect(() => {
    getCenter();
  }, [id]);

  if (!center) {
    return <div className="text-center py-20 text-lg">Yuklanmoqda...</div>;
  }

  return (
    <section className="pt-28 pb-12 px-4 max-w-6xl mx-auto">
    <button 
      onClick={() => navigate(-1)} 
      className="flex items-center gap-2 text-teal-600 mb-6"
    >
      <FaArrowLeft /> Orqaga
    </button>

    <h2 className="Itim text-3xl md:text-4xl flex items-center justify-center gap-2 mb-6 text-emerald-600">
      <FaSchool /> {center.title}
    </h2>

    <Carousel showThumbs={false} showArrows={false} infiniteLoop transitionTime={800} interval={3500} autoPlay>
      {center.images.map((img, index) => (
        <div key={index} className="h-64 md:h-96">
          <LazyLoad height="h-full" src={`${link}/api/edu-center/${img}`} />
        </div>
      ))}
    </Carousel>

    <div className="mt-10 grid md:grid-cols-2 gap-8 text-gray-700 text-lg">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <FaInfoCircle className="text-emerald-600 text-2xl mt-1" />
          <div>
            <h4 className="text-xl font-semibold mb-1">Markaz haqida</h4>
            <p>{center.description}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <FaAward className="text-emerald-600 text-2xl mt-1" />
          <div>
            <h4 className="text-xl font-semibold mb-1">Yutuqlar</h4>
            <p>{center.achive}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <FaMapMarkerAlt className="text-emerald-600 text-2xl mt-1" />
          <div>
            <h4 className="text-xl font-semibold mb-1">Manzil</h4>
            <p>{center.location}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <FaBookOpen className="text-emerald-600 text-2xl mt-1" />
          <div>
            <h4 className="text-xl font-semibold mb-1">O'qitiladigan fanlar</h4>
            <p>{center.existSubjects}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default GetOneCenter;
