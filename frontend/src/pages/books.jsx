import React, { useState, useEffect } from "react";
import { FaSearch, FaBook, FaCalendarAlt, FaInfoCircle } from "react-icons/fa"; // Ikonkalar importi
import { axios } from '../api'; // API chaqirishi
import moment from "moment";
import { hideLoad, showLoad } from "../reducers/load";
import LazyLoad from '../components/lazyImage'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredBooks, setFilteredBooks] = useState([]);
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getAllBooks = async () => {
    dispatch(showLoad())
    try {
      const response = await axios.get("/api/book/get-all");
      if (response.data.ok) {
        setBooks(response.data.data);
        setFilteredBooks(response.data.data); 
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    dispatch(hideLoad())
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault()
    const result = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(result);
  };

  return (
    <div className="min-h-screen bg-white md:p-6 p-2 mt-24">
      <div className="flex items-center justify-center gap-2 px-2 mb-6">
        <FaBook className="text-teal-600 text-3xl md:block hidden" />
        <h2 className="text-3xl font-bold text-teal-700 text-center">{user?.siteId?.title}ning Kutubxonasi</h2>
      </div>

      <form className="flex gap-2 mb-6 items-center justify-center">
        <input
          type="text"
          placeholder={`Kitobni qidiring...`}
          className="max-md:w-full w-1/2 border border-teal-300 rounded-sm focus:outline-2 outline-teal-400 focus-within:border-none px-4 py-2 text-teal-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-teal-600 text-white p-3 rounded-xl"
        >
          <FaSearch />
        </button>
      </form>

      <div className="grid grid-cols-1 items-center md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks?.length ? filteredBooks?.map((book) => (
          <div key={book._id} className="bg-white border border-teal-200 cursor-pointer rounded-md shadow-lg" onClick={() => navigate(`/book/${book._id}`)}>
            <LazyLoad width="w-full" height="h-48" src={book.image}/>
            <div className="p-4 border-t border-teal-700">
              <h3 className="text-xl font-semibold text-teal-600 mb-2">{book.title}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <FaCalendarAlt />
                <span>{moment(book.createdAt).format("DD-MMMM YYYY")}-yil</span>
              </div>
              <p className="text-sm mb-4">{book.goal}</p>

              {/* Iconlar */}
              <div className="flex items-center text-teal-600 gap-2">
                <FaInfoCircle title="Ko'proq ma'lumot" />
                Batafsil bilish
              </div>
            </div>
          </div>
        )) : <div className="w-full items-center flex justify-center">
            <h2 className="text-2xl Itim">Xech Narsa topilmadi!</h2>
          </div>}
      </div>
    </div>
  );
};

export default Books;
