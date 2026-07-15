import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axios } from "../api";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import LazyLoad from '../components/lazyImage'
import { hideLoad, showLoad } from "../reducers/load";

const GetOneNew = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const { link } = useSelector(state => state.load)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getOneNews = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get(`/api/news/get-one/${id}`);
      if (response.data.ok) {
        setNews(response.data.data);
      } else {
        toast.error("Yangilikni olishda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      dispatch(hideLoad())
    }
  };

  useEffect(() => {
    getOneNews();
  }, [id])

  if (!news) {
    return <div className="my-24">Yuklanmoqda...</div>
  }

  return (
    <div className="py-4 max-md:px-1 mt-24 mx-auto">
      <h1 className="text-3xl font-bold text-teal-700 Itim text-center mb-4">{news?.title}</h1>
      
      <div className="flex max-md:flex-col gap-4 justify-center items-center">
        <div className="px-1 max-md:border border-teal-700 w-1/2 rounded-sm overflow-hidden">
            {news?.image && (
                <LazyLoad src={`${link}/api/new-images/${news.image}`} height="max-md:h-52 h-full" width="w-1/2" />
            )}
        </div>
        
       <div>
        <p className="text-teal-500 text-lg">
                {news.description}
            </p>

            <p className="opacity-80">
                {new Date(news.createdAt).toLocaleDateString()} - {new Date(news.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
       </div>
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 md:mx-32 bg-teal-500 text-white rounded hover:bg-teal-600 transition"
      >
        Orqaga qaytish
      </button>
    </div>
  );
};

export default GetOneNew;
