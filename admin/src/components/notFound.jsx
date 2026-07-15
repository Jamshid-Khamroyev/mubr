import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center fixed top-0 left-0 w-full z-[3429] min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-slate-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Kechirasiz, sahifa topilmadi.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-900 transition">
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
};

export default NotFound;
