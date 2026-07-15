import React, { useEffect, useState } from "react";
import { FaUser, FaPhone, FaEnvelope, FaBookOpen, FaSchool, FaPen } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { axios } from '../api/index'

export default function WriteCourse() {
  const { id } = useParams()
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [center, setCenter] = useState(null);

  const getCenter = async () => {
    try {
      const response = await axios.get(`/api/edu-center/get-one/${id}`);
      if (response.data.ok) {
        setCenter(response.data.data);
      } else {
        toast.error("O'quv markazini olishda xatolik yuz berdi.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error("Iltimos, barcha maydonlarni to‘ldiring.");
      return;
    }

    toast.success("Muvaffaqiyatli yozildingiz!");
    setForm({ name: "", phone: "", email: "" });
  };

  useEffect(() => {
    getCenter()
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-teal-700 p-4">
      <div className="max-w-lg w-full shadow-xl p-8 rounded-2xl border border-teal-200 bg-white">
        <div className="flex items-center flex-col justify-center gap-3 mb-6">
          <div className="flex justify-center items-center gap-2">
            <FaSchool className="text-3xl text-teal-600" />
            <h2 className="text-teal-600 font-semibold text-center">{center?.title}</h2>
          </div>
          <h2 className="text-2xl font-bold">Kursga yozilish</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ismingiz"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Telefon raqamingiz"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email manzilingiz"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button
            type="submit"
            className="w-full group flex active:opacity-80 items-center cursor-pointer justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            <FaPen className="-rotate-12 group-hover:rotate-12 duration-300"/> 
            Yozilish
          </button>
        </form>
      </div>
    </div>
  );
}
