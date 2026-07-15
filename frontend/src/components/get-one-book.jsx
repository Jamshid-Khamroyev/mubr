import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBook, FaCalendarAlt, FaInfoCircle, FaQuoteLeft, FaStar } from "react-icons/fa";
import { axios } from "../api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import LazyLoad from '../components/lazyImage';
import moment from "moment";
import { hideLoad, showLoad } from "../reducers/load";

const GetOneBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [book, setBook] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getBook = async () => {
    dispatch(showLoad());
    try {
      const response = await axios.get(`/api/book/get-one/${id}`);
      if (response.data.ok) {
        setBook(response.data.data);
      } else {
        toast.error("Kitobni olishda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi.");
    }
    dispatch(hideLoad());
  };

  const handleRating = async (rating) => {
    setUserRating(rating);
    setSubmitting(true);

    try {
      const res = await axios.put(`/api/book/update/${rating}/${id}`);
      if (res.data.ok) {
        await getBook()
        toast.success("Reyting yuborildi!");
        setSubmitted(true);
      } else {
        toast.error("Reyting yuborilmadi.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reyting yuborishda xatolik.");
    }

    setSubmitting(false);
  };

  useEffect(() => {
    getBook();
  }, [id]);

  if (!book) {
    return <div className="text-center py-20 text-lg">Yuklanmoqda...</div>;
  }

  return (
    <section className="pt-28 pb-12 px-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer gap-2 text-teal-600 mb-6"
      >
        <FaArrowLeft /> Orqaga
      </button>

      <div className="flex flex-col md:flex-row gap-8 bg-white md:p-4 p-1 rounded-lg shadow-lg">
        <div className="w-full md:w-1/2">
          <LazyLoad height="h-72 md:h-96" width="w-full" src={book.image} />
        </div>

        <div className="flex flex-col justify-between w-full md:w-1/2 text-gray-700 space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-2 flex items-center gap-2">
              <FaBook /> {book.title}
            </h2>

            <div className="flex items-center gap-2 text-sm mb-4 text-gray-500">
              <FaCalendarAlt />
              {moment(book.createdAt).format("DD-MMMM YYYY")} - yil
            </div>

            <div className="flex items-center gap-2 text-teal-600">
              <FaStar />
              <span>{book.rating.toFixed(2)} / 5</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <FaInfoCircle className="text-teal-600 text-2xl mt-1" />
              <div>
                <h4 className="text-xl font-semibold mb-1">Kitob haqida</h4>
                <p>{book.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FaQuoteLeft className="text-teal-600 text-2xl mt-1" />
              <div>
                <h4 className="text-xl font-semibold mb-1">Kitob maqsadi</h4>
                <p>{book.goal}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold mb-2">Reytingingizni tanlang:</p>
            <button disabled={userRating} className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`cursor-pointer text-2xl ${
                    userRating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </button>
            {submitting && <p className="text-sm text-gray-500 mt-1">Yuborilmoqda...</p>}
            {submitted && <p className="text-sm text-green-600 mt-1">Reyting yuborildi!</p>}
          </div>

          <div className="flex items-center gap-2 text-teal-600 cursor-pointer mt-4">
            <FaInfoCircle />
            <span className="underline">Ko‘proq ma'lumot</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetOneBook;
