import React, { useState, useEffect } from "react";
import { axios } from "../api"; // axios'ni o'zga fayllarda import qiling
import { FaBullhorn, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { hideLoad, showLoad } from "../reducers/load";
import { useNavigate } from "react-router-dom";
import LazyLoad from '../components/lazyImage'

const News = () => {
  const {link} = useSelector(state => state.load)
  const [news, setNews] = useState([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getNews = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get("/api/news/get-all"); 
      if (response.data.ok) {
        setNews(response.data.data)
      } else {
        toast.error("Yangiliklar olishda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      dispatch(hideLoad())
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <section className="pt-28 pb-12 w-full">
      <div className="text-center flex gap-2 items-center justify-center mb-8">
        <FaBullhorn className="text-teal-600 md:text-3xl text-2xl" />
        <h2 className="text-3xl font-semibold text-teal-600">Yangiliklar</h2>
      </div>

        <div className="grid grid-cols-1 md:px-5 px-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {news?.map((item) => (
            <div
              onClick={() => navigate(`/new/${item._id}`)}
              key={item._id}
              className="bg-white p-4 cursor-pointer overflow-hidden rounded-md shadow-lg border border-teal-200"
            >
              <LazyLoad height="h-48" src={`${link}/api/new-images/${item.image}`}/>
              <h3 className="text-xl font-semibold text-teal-600 mb-2 border-t">
                {item.title}
              </h3>
              
              <p className="text-sm text-teal-600 mb-4">{item.description.slice(0, 300)}</p>
              <div className="flex justify-between items-center gap-3">
                <button className="text-teal-600 hover:text-teal-700 flex items-center gap-2">
                  <FaInfoCircle />
                  Batafsil
                </button>
                <p className="text-teal-500 text-sm mb-2 flex items-center gap-1">
                  <FaCalendarAlt className="text-teal-400" />
                  {new Date(item.createdAt).toLocaleDateString("uz-UZ")}
                </p>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
};

export default News;
